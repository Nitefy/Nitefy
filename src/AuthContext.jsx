import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        setUserPlan(snap.exists() ? snap.data() : null);
      } else {
        setUserPlan(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });

    // Migrate pending plan data written by Stripe webhook before user registered
    const pendingRef = doc(db, "pendingPlans", email.toLowerCase());
    const pendingSnap = await getDoc(pendingRef);

    const userData = {
      email: email.toLowerCase(),
      name,
      plan: null,
      status: "sin_plan",
      createdAt: new Date(),
    };

    if (pendingSnap.exists()) {
      Object.assign(userData, pendingSnap.data());
      await deleteDoc(pendingRef);
    }

    await setDoc(doc(db, "users", cred.user.uid), userData);
    setUserPlan(userData);
    return cred;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const userRef = doc(db, "users", cred.user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      const email = cred.user.email.toLowerCase();
      const pendingRef = doc(db, "pendingPlans", email);
      const pendingSnap = await getDoc(pendingRef);

      const userData = {
        email,
        name: cred.user.displayName || "",
        plan: null,
        status: "sin_plan",
        createdAt: new Date(),
      };

      if (pendingSnap.exists()) {
        Object.assign(userData, pendingSnap.data());
        await deleteDoc(pendingRef);
      }

      await setDoc(userRef, userData);
      setUserPlan(userData);
    } else {
      setUserPlan(snap.data());
    }

    return cred;
  };

  const logout = () => signOut(auth);

  const refreshPlan = async () => {
    if (!auth.currentUser) return;
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    setUserPlan(snap.exists() ? snap.data() : null);
  };

  return (
    <AuthContext.Provider value={{ user, userPlan, loading, login, register, loginWithGoogle, logout, refreshPlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
