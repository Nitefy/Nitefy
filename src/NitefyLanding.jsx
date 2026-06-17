import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { InlineWidget } from "react-calendly";
import { useAuth } from "./AuthContext";
import AuthModal from "./AuthModal";

function Icon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function FaqItem({ q, a, open, onClick }) {
  return (
    <div className="bg-white rounded-xl border-thin border-outline-variant overflow-hidden">
      <button className="flex justify-between items-center p-6 w-full text-left cursor-pointer" onClick={onClick}>
        <span className="font-bold text-on-surface">{q}</span>
        <Icon name="expand_more" className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="p-6 pt-0 text-on-surface-variant border-t-thin border-outline-variant">{a}</div>
      </div>
    </div>
  );
}

function Check({ children, icon = "check" }) {
  return (
    <li className="flex items-start gap-2 text-label-md font-medium">
      <Icon name={icon} className="text-brand-teal shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export default function NitefyLanding() {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  /* ═══════════════════════════════════════════════════════
     CONFIGURACIÓN — Reemplaza estos valores con los tuyos
     ═══════════════════════════════════════════════════════ */
  const CONFIG = {
    // Web3Forms: obtenlo en https://web3forms.com (gratis)
    WEB3FORMS_KEY: "dfca782c-9cce-432c-a43e-789fa528b5b6",

    // Calendly: tu URL de evento (ej: https://calendly.com/sergio-nitefy/15min)
    CALENDLY_URL: "https://calendly.com/nitefy-auto/llamada-de-diagnostico-nitefy",

    // Stripe Payment Links: créalos en https://dashboard.stripe.com/payment-links
    STRIPE_ESENCIAL: "https://buy.stripe.com/fZubIUaW48CV2AJ0Nn5gc01",
    STRIPE_COMPLETO: "https://buy.stripe.com/3cI3coggo6uNdfneEd5gc02",
    STRIPE_TOTAL: "https://buy.stripe.com/aFa8wI0hqdXfejrfIh5gc00",

    // WhatsApp: tu número en formato internacional sin + (ej: 34612345678)
    WHATSAPP: "34TUNUMERO",

    // Email de contacto
    EMAIL: "tu-email@outlook.com",
  };
  /* ═══════════════════════════════════════════════════════ */

  const [form, setForm] = useState({ nombre:"", negocio:"", ubicacion:"", sector:"", empleados:"", tareas:"", email:"", telefono:"" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: CONFIG.WEB3FORMS_KEY,
          subject: `Nuevo diagnóstico Nitefy — ${form.negocio}`,
          from_name: "Nitefy Web",
          nombre: form.nombre,
          negocio: form.negocio,
          ubicacion: form.ubicacion,
          sector: form.sector,
          empleados: form.empleados,
          tareas: form.tareas,
          email: form.email,
          telefono: form.telefono,
        }),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error("Error enviando formulario:", err);
    }
    setSending(false);
  };

  const [openFaq, setOpenFaq] = useState(0);
  const faqs = [
    { q: "¿Tengo que saber algo de programación?", a: "Absolutamente nada. Nosotros nos encargamos de toda la configuración técnica, las integraciones y el mantenimiento. Tú solo recibes los beneficios." },
    { q: "¿Funciona con mi software actual de gestión?", a: "Nuestra tecnología se integra con la mayoría de CRMs, calendarios (Google, Outlook) y sistemas de pago del mercado. Haremos un estudio previo de tus herramientas." },
    { q: "¿Qué pasa si algo se rompe?", a: "Durante la Fase 1, lo arreglo en menos de 8 horas. En la Fase 2, en menos de 24 horas. Monitorizo los flujos continuamente, así que en la mayoría de los casos lo detecto y lo reparo antes de que te enteres." },
    { q: "¿Tengo que firmar permanencia?", a: "No. Puedes cancelar cualquier mes. La garantía del primer mes elimina el riesgo: si en 30 días no te ahorro al menos 10 horas, te devuelvo el 100%." },
    { q: "¿Por qué 497€ y no menos?", a: "Las pymes españolas pierden de media entre 1.000 y 1.800€/mes en tiempo administrativo. Un empleado a media jornada costaría 900-1.200€/mes. Por 497€/mes recuperas la mayor parte de ese tiempo. El servicio se paga solo desde el primer mes." },
  ];

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("opacity-100","translate-y-0"); e.target.classList.remove("opacity-0","translate-y-10"); }
    }), { threshold: 0.1 });
    document.querySelectorAll("[data-animate]").forEach((el) => { el.classList.add("transition-all","duration-1000","opacity-0","translate-y-10"); obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (<>
    {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

    {/* NAV */}
    <nav className="fixed top-0 w-full bg-background z-50 border-b-thin border-outline-variant">
      <div className="flex justify-between items-center h-20 px-4 md:px-margin-desktop max-w-container-max-width mx-auto">
        <Link to="/" className="text-2xl font-bold flex font-headline-md"><span className="text-primary">Nite</span><span className="text-secondary">fy</span></Link>
        <div className="hidden md:flex items-center gap-stack-lg">
          <button onClick={()=>scrollTo("oferta")} className="font-label-md text-on-surface-variant hover:text-secondary transition-colors">Oferta</button>
          <button onClick={()=>scrollTo("diagnostico")} className="font-label-md text-on-surface-variant hover:text-secondary transition-colors">Diagnóstico</button>
          <button onClick={()=>scrollTo("contacto")} className="font-label-md text-on-surface-variant hover:text-secondary transition-colors">Contacto</button>
          {user ? (
            <>
              <Link to="/perfil" className="font-label-md text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-base">person</span>
                {user.displayName || "Mi perfil"}
              </Link>
              <button onClick={logout} className="font-label-md text-on-surface-variant hover:text-error transition-colors">Salir</button>
            </>
          ) : (
            <>
              <button onClick={() => setShowAuth(true)} className="font-label-md text-on-surface-variant hover:text-secondary transition-colors">Iniciar sesión</button>
              <button onClick={()=>scrollTo("diagnostico")} className="bg-secondary text-on-primary px-stack-lg py-2.5 rounded-lg font-label-md transition-transform active:scale-95">Empezar</button>
            </>
          )}
        </div>
      </div>
    </nav>

    <main className="mt-20">
      {/* HERO */}
      <section className="bg-primary py-section-padding px-4 md:px-margin-desktop overflow-hidden">
        <div data-animate className="max-w-container-max-width mx-auto"><div className="max-w-3xl">
          <h1 className="font-display-lg text-4xl md:text-5xl text-white mb-stack-md leading-tight font-medium">Tu negocio funcionando. <br/><span className="text-secondary-fixed-dim">Tú viviendo.</span></h1>
          <p className="font-body-lg text-on-primary-container mb-stack-lg max-w-xl text-lg">Automatizamos la gestión de clientes, reservas y tareas administrativas para que recuperes hasta 40 horas al mes. IA avanzada adaptada a tu comercio local.</p>
          <div className="flex flex-wrap gap-stack-md mb-20">
            <button onClick={()=>scrollTo("diagnostico")} className="bg-secondary text-on-primary px-8 py-4 rounded-lg font-label-md font-bold transition-transform active:scale-95 hover:opacity-90">Recuperar mis horas</button>
            <button onClick={()=>scrollTo("como-funciona")} className="border-thin border-secondary text-secondary px-8 py-4 rounded-lg font-label-md font-bold transition-colors hover:bg-secondary/10">Ver cómo funciona</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[["40-60h","Ahorradas al mes"],["14 días","Implementación total"],["0","Conocimientos técnicos"]].map(([n,l])=>(
              <div key={n} className="p-6 border-thin border-outline-variant rounded-xl bg-primary-container">
                <span className="block text-secondary-fixed-dim font-headline-md text-2xl font-bold mb-1">{n}</span>
                <span className="text-on-primary-container text-sm">{l}</span>
              </div>
            ))}
          </div>
        </div></div>
      </section>

      {/* PROBLEMA */}
      <section className="bg-surface py-section-padding px-4 md:px-margin-desktop" id="oferta">
        <div data-animate className="max-w-container-max-width mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg items-stretch">
            <div className="flex flex-col justify-center">
              <h2 className="font-headline-lg text-3xl text-primary mb-stack-lg font-medium">Cierras la persiana a las 7...<br/>pero sigues trabajando hasta las 11.</h2>
              <div className="p-10 bg-primary rounded-xl text-white">
                <div className="flex items-center gap-4 mb-4"><Icon name="timer_off" className="text-error text-4xl"/><span className="text-2xl font-bold font-headline-md">El coste invisible</span></div>
                <p className="text-lg mb-6 opacity-80">Responder WhatsApps, gestionar stocks y cuadrar citas te roba la vida personal.</p>
                <div className="flex items-end gap-2"><span className="text-4xl font-bold text-error">10 días</span><span className="text-sm pb-3">al mes perdidos en gestión manual.</span></div>
              </div>
            </div>
            <div className="bg-secondary-container p-10 rounded-xl flex flex-col justify-between border-thin border-secondary">
              <div>
                <h3 className="font-headline-md text-xl text-secondary mb-stack-md font-medium">Imagina el mismo día con Nitefy</h3>
                <ul className="space-y-6">
                  {["Atención automática 24/7 sin que suene tu teléfono.","Citas que se agendan solas en tu calendario real.","Pedidos confirmados y facturados automáticamente."].map(t=>(
                    <li key={t} className="flex items-start gap-4"><Icon name="check_circle" className="text-secondary"/><p className="font-medium text-on-secondary-fixed">{t}</p></li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 p-6 bg-white rounded-xl border-thin border-secondary/20">
                <p className="text-sm text-secondary font-bold italic">"Mi negocio ahora corre solo. He vuelto a cenar con mi familia todos los días." — Manuel G., Taller Mecánico.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="bg-white py-section-padding px-4 md:px-margin-desktop" id="como-funciona">
        <div data-animate className="max-w-container-max-width mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-3xl text-primary mb-4 font-medium">Un proceso sencillo para un cambio radical</h2>
            <p className="text-on-surface-variant text-lg">Sin complicaciones técnicas para ti. Nosotros nos encargamos de todo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-[0.5px] bg-secondary-container z-0"/>
            {[["01","Diagnóstico","Analizamos tus tareas repetitivas y detectamos dónde pierdes más tiempo."],["02","Configuración","Creamos tu ecosistema personalizado y lo conectamos a tus herramientas."],["03","Libertad","Tu negocio empieza a trabajar solo. Tú solo supervisas desde el móvil."]].map(([n,t,d])=>(
              <div key={n} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-secondary-container flex items-center justify-center text-secondary font-bold text-2xl mb-stack-lg border-thin border-secondary font-headline-md">{n}</div>
                <h4 className="font-headline-md text-xl mb-stack-sm font-medium">{t}</h4>
                <p className="text-on-surface-variant">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section className="bg-[#F4F3EF] py-section-padding px-4 md:px-margin-desktop">
        <div data-animate className="max-w-container-max-width mx-auto">
          <div className="text-center mb-16"><h2 className="font-headline-lg text-3xl text-primary mb-4 font-medium">NEGOCIO AUTOMÁTICO</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-stretch mb-16 max-w-6xl mx-auto">
            {/* Esencial */}
            <div className="bg-white p-8 rounded-xl border-thin border-outline-variant flex flex-col">
              <span className="text-sm font-medium text-outline mb-4">ESENCIAL</span>
              <div className="mb-6"><span className="text-3xl font-medium text-primary font-headline-lg">297€</span><span className="text-on-surface-variant text-sm">/mes · 4 meses</span></div>
              <ul className="space-y-4 mb-8 flex-grow">
                <Check>Diagnóstico presencial</Check>
                <Check>1 automatización cada 2 meses (2 flujos en total)</Check>
                <Check>Integración con herramientas actuales</Check>
                <Check>Soporte por WhatsApp (48h)</Check>
                <li className="flex items-start gap-2 text-sm font-medium text-on-surface-variant italic"><Icon name="info" className="text-brand-teal shrink-0"/><span>Fase 2: 127€/mes mantenimiento</span></li>
              </ul>
              <a href={CONFIG.STRIPE_ESENCIAL} target="_blank" rel="noopener noreferrer" className="w-full border-thin border-primary py-3 rounded-lg font-medium text-sm hover:bg-surface-variant transition-colors text-center block">Consultar</a>
            </div>
            {/* Completo */}
            <div className="bg-white p-8 rounded-xl border-2 border-brand-teal flex flex-col relative scale-100 md:scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-teal text-white px-4 py-1 rounded-full text-xs font-medium">RECOMENDADO</div>
              <span className="text-sm font-medium text-brand-teal mb-4">COMPLETO</span>
              <div className="mb-6"><span className="text-3xl font-medium text-primary font-headline-lg">497€</span><span className="text-on-surface-variant text-sm">/mes · 6 meses</span></div>
              <ul className="space-y-3 mb-8 flex-grow">
                <Check>Diagnóstico presencial completo</Check>
                <Check>1 automatización nueva cada mes (6-8 flujos totales)</Check>
                <Check>Integración con todas las herramientas</Check>
                <Check>Soporte prioritario WhatsApp (8h)</Check>
                <Check>Informe mensual de horas ahorradas</Check>
                <Check>Vídeo-guía de cada automatización</Check>
                <Check>Auditoría digital de herramientas</Check>
                <Check>Optimización mensual de flujos</Check>
                <li className="flex items-start gap-2 text-sm font-medium text-on-surface-variant italic"><Icon name="info" className="text-brand-teal shrink-0"/><span>Fase 2: 197€/mes mantenimiento</span></li>
                <li className="mt-4 p-3 bg-secondary-container/30 rounded-lg text-xs font-medium border-thin border-brand-teal/20"><span className="text-brand-teal">Garantía:</span> Si en 30 días no te ahorro 20h, te devuelvo el 100%</li>
              </ul>
              <a href={CONFIG.STRIPE_COMPLETO} target="_blank" rel="noopener noreferrer" className="w-full bg-brand-teal text-white py-4 rounded-lg font-medium text-sm hover:bg-brand-teal/90 transition-colors text-center block">Empezar ahora</a>
            </div>
            {/* Total */}
            <div className="bg-white p-8 rounded-xl border-thin border-outline-variant flex flex-col">
              <span className="text-sm font-medium text-outline mb-4">TOTAL</span>
              <div className="mb-6"><span className="text-3xl font-medium text-primary font-headline-lg">797€</span><span className="text-on-surface-variant text-sm">/mes · 6 meses</span></div>
              <ul className="space-y-4 mb-8 flex-grow">
                <Check>Todo lo del plan Completo</Check>
                <Check icon="add_circle">2 automatizaciones al mes (12-14 flujos)</Check>
                <Check>Sesión estratégica mensual presencial (1h)</Check>
                <Check>Dashboard de KPIs en tiempo real</Check>
                <Check>Soporte prioritario (4h)</Check>
                <Check>Formación presencial al equipo (1 sesión/mes)</Check>
                <li className="flex items-start gap-2 text-sm font-medium text-on-surface-variant italic"><Icon name="info" className="text-brand-teal shrink-0"/><span>Fase 2: 297€/mes (incluye 1 auto nueva/trimestre)</span></li>
              </ul>
              <a href={CONFIG.STRIPE_TOTAL} target="_blank" rel="noopener noreferrer" className="w-full border-thin border-primary py-3 rounded-lg font-medium text-sm hover:bg-surface-variant transition-colors text-center block">Consultar</a>
            </div>
          </div>
          {/* Ahorro */}
          <div className="max-w-2xl mx-auto bg-primary-container p-8 rounded-xl border-thin border-outline-variant">
            <h4 className="text-white font-headline-md text-xl mb-6 text-center font-medium">Comparativa de ahorro mensual</h4>
            <div className="flex flex-col md:flex-row gap-8 items-center justify-around">
              <div className="text-center"><p className="text-on-primary-container text-sm mb-2">Coste Tiempo Manual</p><p className="text-error font-medium text-3xl font-headline-lg">-1.250€</p></div>
              <div className="hidden md:block h-12 w-[0.5px] bg-outline"/>
              <div className="text-center"><p className="text-secondary-fixed-dim text-sm mb-2">Ahorro Neto Nitefy</p><p className="text-secondary font-medium text-3xl font-headline-lg">+753€</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section className="bg-primary py-section-padding px-4 md:px-margin-desktop" id="diagnostico">
        <div data-animate className="max-w-container-max-width mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-stack-lg">
            <div className="lg:col-span-2 text-white">
              <h2 className="font-headline-lg text-3xl mb-stack-md font-medium">¿Cuánto tiempo estás perdiendo hoy?</h2>
              <p className="text-on-primary-container text-lg mb-8">Completa este breve diagnóstico y recibe un informe personalizado con los procesos exactos que podrías automatizar esta misma semana.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4"><Icon name="bolt" className="text-secondary"/><span className="text-sm">Resultado en menos de 24h</span></div>
                <div className="flex items-center gap-4"><Icon name="lock" className="text-secondary"/><span className="text-sm">Datos 100% privados</span></div>
              </div>
            </div>
            <div className="lg:col-span-3 bg-white p-10 rounded-xl">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant">Nombre</label><input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border-thin border-outline-variant rounded-lg p-3 focus:border-secondary outline-none" placeholder="Tu nombre" required/></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant">Nombre del Negocio</label><input name="negocio" value={form.negocio} onChange={handleChange} className="w-full border-thin border-outline-variant rounded-lg p-3 focus:border-secondary outline-none" placeholder="Ej: Clínica Dental Smile" required/></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant">Ubicación</label><input name="ubicacion" value={form.ubicacion} onChange={handleChange} className="w-full border-thin border-outline-variant rounded-lg p-3 focus:border-secondary outline-none" placeholder="Ej: Madrid, España"/></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant">Sector</label>
                    <select name="sector" value={form.sector} onChange={handleChange} className="w-full border-thin border-outline-variant rounded-lg p-3 focus:border-secondary outline-none">
                      <option value="">Selecciona...</option><option>Hostelería</option><option>Salud/Clínicas</option><option>Talleres/Servicios</option><option>Comercio Retail</option><option>Reformas y construcción</option><option>Academia / formación</option><option>Servicios profesionales</option><option>Instalaciones</option><option>Otro</option>
                    </select>
                  </div>
                  <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant">Empleados</label>
                    <select name="empleados" value={form.empleados} onChange={handleChange} className="w-full border-thin border-outline-variant rounded-lg p-3 focus:border-secondary outline-none">
                      <option value="">Selecciona...</option><option>Solo yo</option><option>2-5 empleados</option><option>6-15 empleados</option><option>+15 empleados</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-1"><label className="text-xs font-bold text-on-surface-variant">Tareas que más tiempo te quitan</label><textarea name="tareas" value={form.tareas} onChange={handleChange} className="w-full border-thin border-outline-variant rounded-lg p-3 focus:border-secondary outline-none" placeholder="Ej: Responder WhatsApps, dar citas, pedidos..." rows="3"/></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant">Email</label><input name="email" value={form.email} onChange={handleChange} type="email" className="w-full border-thin border-outline-variant rounded-lg p-3 focus:border-secondary outline-none" placeholder="email@negocio.com" required/></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant">WhatsApp</label><input name="telefono" value={form.telefono} onChange={handleChange} type="tel" className="w-full border-thin border-outline-variant rounded-lg p-3 focus:border-secondary outline-none" placeholder="+34 600 000 000"/></div>
                  <div className="md:col-span-2 mt-4"><button type="submit" disabled={sending} className="w-full bg-secondary text-white py-4 rounded-lg font-bold text-sm transition-transform active:scale-95 disabled:opacity-60">{sending ? "Enviando..." : "Enviar mi diagnóstico gratuito"}</button></div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mx-auto mb-4"><Icon name="check_circle" className="text-secondary text-4xl"/></div>
                  <h3 className="text-2xl font-medium text-on-surface mb-2 font-headline-md">Recibido{form.nombre ? `, ${form.nombre}` : ""}</h3>
                  <p className="text-on-surface-variant max-w-md mx-auto">En menos de 24 horas recibirás tu diagnóstico personalizado por email y WhatsApp con las tareas que puedo automatizar y cuántas horas recuperarías al mes.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CALENDLY */}
      <section className="bg-white py-section-padding px-4 md:px-margin-desktop" id="llamada">
        <div data-animate className="max-w-container-max-width mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-headline-lg text-3xl mb-stack-md text-primary font-medium">Hablemos 15 minutos</h2>
              <p className="text-lg text-on-surface-variant mb-10">Agenda una llamada estratégica sin compromiso. Te enseñaremos ejemplos reales de negocios similares al tuyo que ya han recuperado su tiempo.</p>
              <div className="space-y-8">
                <div className="flex gap-6"><div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0"><Icon name="event_available" className="text-secondary"/></div><div><h5 className="font-bold">Elige tu momento</h5><p className="text-sm text-on-surface-variant">Sin presiones, cuando mejor te venga.</p></div></div>
                <div className="flex gap-6"><div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0"><Icon name="forum" className="text-secondary"/></div><div><h5 className="font-bold">Sesión Estratégica</h5><p className="text-sm text-on-surface-variant">No es una llamada de ventas, es una sesión de valor.</p></div></div>
              </div>
            </div>
            <div className="bg-surface rounded-xl border-thin border-outline-variant overflow-hidden">
              <InlineWidget
                url={CONFIG.CALENDLY_URL}
                styles={{ height:"630px" }}
                pageSettings={{ backgroundColor:"faf9f5", hideEventTypeDetails:true, hideLandingPageDetails:false, primaryColor:"2B9E8F", textColor:"1b1c1a" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface py-section-padding px-4 md:px-margin-desktop">
        <div data-animate className="max-w-3xl mx-auto">
          <h2 className="font-headline-lg text-3xl text-center mb-12 font-medium">Preguntas Frecuentes</h2>
          <div className="space-y-4">{faqs.map((f,i)=>(<FaqItem key={i} q={f.q} a={f.a} open={openFaq===i} onClick={()=>setOpenFaq(openFaq===i?-1:i)}/>))}</div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-primary py-section-padding px-4 md:px-margin-desktop text-center">
        <div data-animate className="max-w-2xl mx-auto">
          <h2 className="font-display-lg text-3xl md:text-4xl text-white mb-stack-lg leading-tight font-medium">El coste de no automatizar es tu <span className="text-secondary-fixed-dim">libertad</span>.</h2>
          <p className="text-on-primary-container text-lg mb-12">Cada mes sin automatizar te cuesta más de 1.000€ en horas perdidas.</p>
          <button onClick={()=>scrollTo("diagnostico")} className="bg-[#E8A44A] text-primary px-12 py-5 rounded-lg font-headline-md text-xl font-bold transition-transform hover:scale-105 active:scale-95">Solicitar Diagnóstico Ahora</button>
        </div>
      </section>
    </main>

    {/* FOOTER */}
    <footer className="bg-primary border-t-thin border-outline-variant/30 py-20 px-4 md:px-margin-desktop" id="contacto">
      <div className="max-w-container-max-width mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div>
          <div className="text-2xl font-bold flex mb-6 font-headline-md"><span className="text-white">Nite</span><span className="text-secondary-fixed-dim">fy</span></div>
          <p className="text-on-primary-container max-w-xs mb-8">Ayudando a los negocios locales de España a dar el salto tecnológico sin complicaciones.</p>
          <div className="flex gap-4">
            <a href="https://nitefy.es" className="w-10 h-10 rounded-full border-thin border-outline-variant flex items-center justify-center text-on-primary-container hover:text-white hover:border-white"><Icon name="public" className="text-sm"/></a>
            <a href={`mailto:${CONFIG.EMAIL}`} className="w-10 h-10 rounded-full border-thin border-outline-variant flex items-center justify-center text-on-primary-container hover:text-white hover:border-white"><Icon name="alternate_email" className="text-sm"/></a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-20">
          <div><h6 className="text-white font-bold mb-6">Explora</h6><ul className="space-y-4 text-on-primary-container text-sm"><li><button onClick={()=>scrollTo("oferta")} className="hover:text-secondary-fixed-dim">Nuestra Oferta</button></li><li><button onClick={()=>scrollTo("diagnostico")} className="hover:text-secondary-fixed-dim">Diagnóstico</button></li><li><button onClick={()=>scrollTo("como-funciona")} className="hover:text-secondary-fixed-dim">Cómo Funciona</button></li></ul></div>
          <div><h6 className="text-white font-bold mb-6">Legal</h6><ul className="space-y-4 text-on-primary-container text-sm"><li><a href="#" className="hover:text-secondary-fixed-dim">Privacidad</a></li><li><a href="#" className="hover:text-secondary-fixed-dim">Términos</a></li><li><a href="#" className="hover:text-secondary-fixed-dim">Cookies</a></li></ul></div>
        </div>
        <div className="bg-primary-container p-8 rounded-xl border-thin border-outline-variant/30 w-full md:w-auto">
          <h6 className="text-white font-bold mb-4">¿Hablamos por WhatsApp?</h6>
          <p className="text-on-primary-container text-sm mb-6">Respondemos en menos de 1 hora.</p>
          <a href={`https://wa.me/${CONFIG.WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="bg-secondary text-white w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2"><Icon name="chat"/> Escríbenos</a>
        </div>
      </div>
      <div className="max-w-container-max-width mx-auto mt-20 pt-8 border-t-thin border-outline-variant/10 text-center">
        <p className="text-on-primary-container text-xs">© 2026 Nitefy. Automatización para negocios locales. Made in Spain.</p>
      </div>
    </footer>
  </>);
}
