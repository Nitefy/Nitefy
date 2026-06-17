import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Icon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

const PLAN_LABELS = {
  esencial: "Esencial",
  completo: "Completo",
  total: "Total",
};

const PLAN_PRICES = {
  esencial: "297€/mes",
  completo: "497€/mes",
  total: "797€/mes",
};

const STATUS_CONFIG = {
  active: { label: "Activo", color: "text-secondary", bg: "bg-secondary-container" },
  pending: { label: "Pendiente de activación", color: "text-on-surface-variant", bg: "bg-surface-container" },
  sin_plan: { label: "Sin plan activo", color: "text-on-surface-variant", bg: "bg-surface-container" },
  cancelled: { label: "Cancelado", color: "text-error", bg: "bg-error-container" },
};

function formatDate(value) {
  if (!value) return "—";
  const date = value?.toDate ? value.toDate() : new Date(value);
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

export default function ProfilePage() {
  const { user, userPlan, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  const plan = userPlan?.plan;
  const status = userPlan?.status || "sin_plan";
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.sin_plan;
  const automatizaciones = userPlan?.automatizaciones || [];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <nav className="bg-primary border-b-thin border-outline-variant/30">
        <div className="flex justify-between items-center h-20 px-4 md:px-margin-desktop max-w-container-max-width mx-auto">
          <Link to="/" className="text-2xl font-bold flex font-headline-md">
            <span className="text-white">Nite</span>
            <span className="text-secondary-fixed-dim">fy</span>
          </Link>
          <div className="flex items-center gap-stack-md">
            <span className="hidden md:block text-on-primary-container text-sm">
              {user.displayName || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border-thin border-outline-variant/40 text-on-primary-container hover:text-white hover:border-white transition-colors px-4 py-2 rounded-lg text-sm"
            >
              <Icon name="logout" className="text-base" />
              Salir
            </button>
          </div>
        </div>
      </nav>

      {/* Hero de perfil */}
      <section className="bg-primary-container py-12 px-4 md:px-margin-desktop border-b-thin border-outline-variant/20">
        <div className="max-w-container-max-width mx-auto">
          <p className="text-on-primary-container text-sm mb-2">Mi cuenta</p>
          <h1 className="font-headline-lg text-2xl md:text-3xl text-white font-medium mb-3">
            Hola, {user.displayName || "cliente"}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusCfg.bg} ${statusCfg.color}`}>
              {status === "active" && <Icon name="check_circle" className="text-base" />}
              {statusCfg.label}
            </span>
            {plan && (
              <span className="text-on-primary-container text-sm">
                Plan {PLAN_LABELS[plan]} · {PLAN_PRICES[plan]}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Contenido */}
      <main className="py-12 px-4 md:px-margin-desktop max-w-container-max-width mx-auto">
        {status === "sin_plan" ? (
          <NoPlanState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-gutter">
              <PlanCard plan={plan} status={status} statusCfg={statusCfg} userPlan={userPlan} />
              <AutomatizacionesCard automatizaciones={automatizaciones} />
            </div>
            {/* Columna lateral */}
            <div className="space-y-gutter">
              <ContactCard />
              <InfoCard plan={plan} userPlan={userPlan} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function PlanCard({ plan, status, statusCfg, userPlan }) {
  return (
    <div className="bg-white rounded-xl border-thin border-outline-variant p-8">
      <h2 className="font-headline-md text-lg font-medium mb-6 text-on-surface">Tu plan actual</h2>
      {plan ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b-thin border-outline-variant">
            <span className="text-sm text-on-surface-variant">Plan</span>
            <span className="font-medium text-on-surface">Piloto Automático {PLAN_LABELS[plan]}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b-thin border-outline-variant">
            <span className="text-sm text-on-surface-variant">Estado</span>
            <span className={`font-medium ${statusCfg.color}`}>{statusCfg.label}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b-thin border-outline-variant">
            <span className="text-sm text-on-surface-variant">Activo desde</span>
            <span className="font-medium text-on-surface">{formatDate(userPlan?.activeSince)}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-on-surface-variant">Precio mensual</span>
            <span className="font-medium text-on-surface">{PLAN_PRICES[plan]}</span>
          </div>
        </div>
      ) : (
        <p className="text-on-surface-variant text-sm">No hay información de plan disponible.</p>
      )}
    </div>
  );
}

function AutomatizacionesCard({ automatizaciones }) {
  return (
    <div className="bg-white rounded-xl border-thin border-outline-variant p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline-md text-lg font-medium text-on-surface">Automatizaciones activas</h2>
        <span className="bg-secondary-container text-secondary text-xs font-medium px-2.5 py-1 rounded-full">
          {automatizaciones.length}
        </span>
      </div>
      {automatizaciones.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
            <Icon name="precision_manufacturing" className="text-on-surface-variant" />
          </div>
          <p className="text-on-surface-variant text-sm">
            Tus automatizaciones aparecerán aquí cuando estén configuradas.
          </p>
          <p className="text-on-surface-variant text-xs mt-1">
            La primera estará lista en 14 días.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {automatizaciones.map((a, i) => (
            <li key={i} className="flex items-start gap-4 p-4 bg-surface-container-low rounded-lg">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                <Icon name="check" className="text-secondary text-base" />
              </div>
              <div>
                <p className="font-medium text-sm text-on-surface">{a.nombre}</p>
                {a.descripcion && (
                  <p className="text-xs text-on-surface-variant mt-0.5">{a.descripcion}</p>
                )}
                {a.activaDesde && (
                  <p className="text-xs text-on-surface-variant mt-1">
                    Desde {formatDate(a.activaDesde)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ContactCard() {
  const WHATSAPP = import.meta.env.VITE_WHATSAPP || "34TUNUMERO";
  const EMAIL = import.meta.env.VITE_EMAIL || "tu-email@outlook.com";

  return (
    <div className="bg-primary-container rounded-xl p-6 border-thin border-outline-variant/30">
      <h3 className="font-medium text-white mb-1">¿Necesitas algo?</h3>
      <p className="text-on-primary-container text-sm mb-5">
        Respondo en menos de 4 horas.
      </p>
      <div className="space-y-3">
        <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-secondary text-white w-full py-2.5 rounded-lg text-sm font-medium justify-center transition-opacity hover:opacity-90"
        >
          <Icon name="chat" className="text-base" />
          WhatsApp
        </a>
        <a
          href={`mailto:${EMAIL}`}
          className="flex items-center gap-2 border-thin border-outline-variant/40 text-on-primary-container w-full py-2.5 rounded-lg text-sm font-medium justify-center transition-colors hover:text-white hover:border-white"
        >
          <Icon name="alternate_email" className="text-base" />
          Email
        </a>
      </div>
    </div>
  );
}

function InfoCard({ plan, userPlan }) {
  const fase = userPlan?.status === "active" ? "Fase 1 · Construcción" : "—";
  const maintenance = { esencial: "127€/mes", completo: "197€/mes", total: "297€/mes" };

  return (
    <div className="bg-white rounded-xl border-thin border-outline-variant p-6">
      <h3 className="font-medium text-on-surface mb-4 text-sm">Detalles del servicio</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Fase</span>
          <span className="text-on-surface font-medium">{fase}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Mantenimiento (mes 7+)</span>
          <span className="text-on-surface font-medium">{plan ? maintenance[plan] : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Garantía</span>
          <span className="text-secondary font-medium">30 días</span>
        </div>
      </div>
    </div>
  );
}

function NoPlanState() {
  return (
    <div className="max-w-xl mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-6">
        <Icon name="rocket_launch" className="text-on-surface-variant text-3xl" />
      </div>
      <h2 className="font-headline-md text-xl font-medium text-on-surface mb-3">
        Aún no tienes un plan activo
      </h2>
      <p className="text-on-surface-variant mb-8">
        Elige el plan que mejor se adapta a tu negocio y empieza a recuperar tu tiempo esta misma semana.
      </p>
      <Link
        to="/#oferta"
        className="inline-block bg-secondary text-white px-8 py-3.5 rounded-lg font-label-md text-sm transition-transform active:scale-95 hover:opacity-90"
      >
        Ver planes
      </Link>
    </div>
  );
}
