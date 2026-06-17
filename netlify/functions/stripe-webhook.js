const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Netlify stores multiline env vars with literal \n — restore actual newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();
const firebaseAuth = admin.auth();

// Map Stripe payment link IDs to plan slugs.
// Set these env vars in Netlify to match your actual Stripe payment link IDs.
const LINK_TO_PLAN = {
  [process.env.STRIPE_LINK_ID_ESENCIAL]: "esencial",
  [process.env.STRIPE_LINK_ID_COMPLETO]: "completo",
  [process.env.STRIPE_LINK_ID_TOTAL]: "total",
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const sig = event.headers["stripe-signature"];
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf-8")
    : event.body;
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature error:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    const email = session.customer_details?.email || session.customer_email;

    if (!email) {
      console.error("No email found in Stripe session:", session.id);
      return { statusCode: 200, body: JSON.stringify({ received: true }) };
    }

    // Determine plan from payment_link ID, or fall back to metadata
    const plan =
      LINK_TO_PLAN[session.payment_link] ||
      session.metadata?.plan ||
      "completo";

    const planData = {
      plan,
      status: "active",
      stripeCustomerId: session.customer,
      stripeSessionId: session.id,
      activeSince: admin.firestore.Timestamp.now(),
      automatizaciones: [],
    };

    try {
      // If user already registered with this email, update their doc directly
      const userRecord = await firebaseAuth.getUserByEmail(email);
      await db
        .collection("users")
        .doc(userRecord.uid)
        .set(planData, { merge: true });
      console.log(`Plan activated for existing user: ${email}`);
    } catch {
      // User hasn't registered yet — store in pendingPlans so it migrates on registration
      await db
        .collection("pendingPlans")
        .doc(email.toLowerCase())
        .set({ ...planData, email: email.toLowerCase(), purchasedAt: admin.firestore.Timestamp.now() });
      console.log(`Pending plan stored for: ${email}`);
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
