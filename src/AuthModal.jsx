import { useState } from "react";
import { useAuth } from "./AuthContext";

function Icon({ name, className = "" }) {
  return (
    <span className={`material-symbols-outlined select-none ${className}`} style={{ fontSize: "20px" }}>
      {name}
    </span>
  );
}

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, loginWithGoogle } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const switchTab = (t) => {
    setTab(t);
    setError("");
    setForm({ name: "", email: "", password: "" });
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        await login(form.email, form.password);
      } else {
        if (!form.name.trim()) {
          setError("Introduce tu nombre.");
          setLoading(false);
          return;
        }
        await register(form.email, form.password, form.name.trim());
      }
      onClose();
    } catch (err) {
      setError(friendlyError(err.code));
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(3,7,29,0.72)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-xl"
        style={{ boxShadow: "0 24px 48px rgba(3,7,29,0.4)" }}
      >
        {/* Header oscuro con marca */}
        <div className="bg-primary-container px-8 pt-8 pb-6 relative">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <Icon name="close" className="text-xl" />
          </button>

          {/* Logo */}
          <div className="font-headline-md" style={{ fontSize: "20px", letterSpacing: "-0.02em" }}>
            <span className="text-white">Nite</span>
            <span className="text-secondary-fixed-dim">fy</span>
          </div>

          <h2
            className="text-white mt-5 font-headline-md leading-tight"
            style={{ fontSize: "22px" }}
          >
            {tab === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </h2>
          <p className="mt-1 font-body-md text-sm" style={{ color: "rgba(111,216,199,0.65)" }}>
            {tab === "login"
              ? "Accede a tu área de cliente"
              : "Únete y empieza a automatizar"}
          </p>

          {/* Tab pills */}
          <div
            className="flex mt-6 rounded-lg p-1 gap-1"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            {[
              { key: "login", label: "Iniciar sesión" },
              { key: "register", label: "Crear cuenta" },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => switchTab(key)}
                className={`flex-1 py-2 rounded-md text-xs font-label-md transition-all ${
                  tab === key
                    ? "bg-secondary text-white"
                    : "text-white/50 hover:text-white/75"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-surface px-8 pt-6 pb-7 space-y-4">
          {/* Google */}
          <button
            type="button"
            onClick={async () => {
              setError("");
              setLoading(true);
              try {
                await loginWithGoogle();
                onClose();
              } catch (err) {
                setError(friendlyError(err.code));
              }
              setLoading(false);
            }}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-lg py-3 text-sm font-label-md text-on-surface border-thin border-outline-variant bg-white hover:bg-surface transition-colors disabled:opacity-60"
          >
            <GoogleIcon />
            Continuar con Google
          </button>

          {/* Divisor */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-outline-variant/60" />
            <span className="text-xs text-on-surface-variant">o</span>
            <div className="flex-1 border-t border-outline-variant/60" />
          </div>
          {tab === "register" && (
            <Field
              icon="person"
              label="Nombre"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Tu nombre completo"
            />
          )}

          <Field
            icon="mail"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@negocio.com"
            required
          />

          <div className="space-y-1">
            <label className="block text-xs font-label-sm text-on-surface-variant">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <span
                className="absolute left-3 text-on-surface-variant"
                style={{ pointerEvents: "none" }}
              >
                <Icon name="lock" />
              </span>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
                className="w-full bg-white rounded-lg py-3 pl-10 pr-10 text-sm text-on-surface placeholder-on-surface-variant/50 outline-none transition-all border-thin border-outline-variant focus:border-secondary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-on-surface-variant hover:text-on-surface transition-colors"
                tabIndex={-1}
              >
                <Icon name={showPassword ? "visibility_off" : "visibility"} />
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg px-3 py-2.5 bg-red-50 border-thin border-red-200">
              <Icon name="error" className="text-error mt-0.5 shrink-0" />
              <p className="text-sm text-error leading-snug">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white py-3.5 rounded-lg font-label-md text-sm transition-all active:scale-95 disabled:opacity-60 mt-1"
            style={{ letterSpacing: "0.01em" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                />
                Un momento...
              </span>
            ) : tab === "login" ? (
              "Entrar"
            ) : (
              "Crear cuenta"
            )}
          </button>

          <p className="text-center text-xs text-on-surface-variant pt-1">
            {tab === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("register")}
                  className="text-secondary hover:underline font-label-sm"
                >
                  Créala aquí
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className="text-secondary hover:underline font-label-sm"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ icon, label, name, type, value, onChange, placeholder, required }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-label-sm text-on-surface-variant">{label}</label>
      <div className="relative flex items-center">
        <span
          className="absolute left-3 text-on-surface-variant"
          style={{ pointerEvents: "none" }}
        >
          <Icon name={icon} />
        </span>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-white rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface placeholder-on-surface-variant/50 outline-none transition-all border-thin border-outline-variant focus:border-secondary"
        />
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function friendlyError(code) {
  const map = {
    "auth/invalid-credential": "Email o contraseña incorrectos.",
    "auth/user-not-found": "No existe una cuenta con ese email.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/email-already-in-use": "Ya existe una cuenta con ese email. Inicia sesión.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.",
    "auth/network-request-failed": "Error de red. Comprueba tu conexión.",
  };
  return map[code] || "Ha ocurrido un error. Inténtalo de nuevo.";
}
