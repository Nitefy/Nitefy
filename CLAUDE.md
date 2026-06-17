# CLAUDE.md — Contexto del proyecto Nitefy

## Qué es este proyecto

Landing page de **Nitefy**, un servicio de automatización de tareas repetitivas para pequeños negocios locales en España. El fundador es Sergio. El cliente objetivo es un dueño de negocio local de 45-60 años, no técnico, que pierde más de 40 horas al mes en papeleo.

## Stack técnico

- **Framework**: React (Vite)
- **Estilos**: Tailwind CSS v3 via CDN (configurado en `index.html`, NO como dependencia npm)
- **Iconos**: Google Material Symbols Outlined (via CDN)
- **Tipografías**: DM Sans (titulares) + Inter (cuerpo) via Google Fonts
- **Hosting**: Netlify (config en `netlify.toml`)
- **Deploy**: push a GitHub → Netlify auto-deploy

## Estructura del proyecto

```
nitefy-web/
├── public/favicon.svg          # Favicon "Nf" sobre fondo Midnight
├── src/
│   ├── App.jsx                 # Wrapper que renderiza NitefyLanding
│   ├── NitefyLanding.jsx       # TODO el landing page (componente único)
│   ├── main.jsx                # Punto de entrada React
│   └── index.css               # Reset CSS mínimo
├── index.html                  # Tailwind CDN + config de tema + meta tags SEO
├── netlify.toml                # Config de build y redirects para SPA
└── package.json
```

## Componente principal: NitefyLanding.jsx

Todo el landing está en un solo archivo. Tiene un bloque `CONFIG` al principio con todos los valores que Sergio debe personalizar:

```js
const CONFIG = {
  WEB3FORMS_KEY: "TU_ACCESS_KEY_AQUI",       // web3forms.com
  CALENDLY_URL: "https://calendly.com/...",   // URL del evento
  STRIPE_ESENCIAL: "https://buy.stripe.com/...",
  STRIPE_COMPLETO: "https://buy.stripe.com/...",
  STRIPE_TOTAL: "https://buy.stripe.com/...",
  WHATSAPP: "34TUNUMERO",                     // sin +
  EMAIL: "tu-email@outlook.com",
};
```

### Secciones de la página (en orden):

1. **Nav** — sticky, logo bicolor Nite(fy), links + botón CTA
2. **Hero** — fondo Midnight, tagline, 3 métricas, 2 CTAs
3. **Problema** — "Cierras la persiana a las 7", datos de coste, bloque "Imagina con Nitefy"
4. **Cómo funciona** — 3 pasos con círculos numerados
5. **Precios** — 3 tarjetas (Esencial 297€, Completo 497€ destacado, Total 797€) + comparativa ahorro
6. **Formulario diagnóstico** — lead magnet, envía a Web3Forms API via fetch POST
7. **Calendly** — embed de react-calendly (InlineWidget)
8. **FAQ** — acordeón React con estado
9. **CTA final** — fondo Midnight, botón Amber
10. **Footer** — logo, links, bloque WhatsApp

### Integraciones:

- **Formulario** → Web3Forms API (POST a `https://api.web3forms.com/submit`)
- **Calendario** → `react-calendly` InlineWidget con colores de marca
- **Pagos** → Stripe Payment Links (enlaces externos en botones de pricing)
- **WhatsApp** → enlace `wa.me/` con número del CONFIG

## Identidad visual

### Colores principales (definidos en tailwind.config dentro de index.html):

| Token Tailwind | HEX | Uso |
|---|---|---|
| `primary` | #03071D | Texto oscuro, fondos hero |
| `primary-container` | #1A1F36 | Fondos de sección oscura (Midnight) |
| `secondary` | #006B5F | Botones, acciones, Teal principal |
| `secondary-container` | #8CF5E3 | Fondos claros de contraste positivo |
| `secondary-fixed-dim` | #6FD8C7 | Texto Teal sobre fondos oscuros |
| `brand-teal` | #2B9E8F | Accent de marca, borde plan destacado |
| `error` | #BA1A1A | Datos negativos, alertas |
| `surface` | #FAF9F5 | Fondo general (Cream) |
| `on-surface` | #1B1C1A | Texto principal |
| `on-surface-variant` | #46464D | Texto secundario |
| `outline-variant` | #C7C5CE | Bordes sutiles |

### Tipografía:

- **DM Sans 500** → titulares (H1, H2, logo). Nunca bold (700).
- **Inter 400/500** → cuerpo, labels, botones. Nunca bold (700).
- Clases Tailwind personalizadas: `font-headline-lg`, `font-headline-md`, `font-display-lg`, `font-body-lg`, `font-body-md`, `font-label-md`, `font-label-sm`

### Logotipo:

- Wordmark: "Nite" + "fy" (la N siempre mayúscula)
- Sobre claro: "Nite" en `text-primary` + "fy" en `text-secondary`
- Sobre oscuro: "Nite" en `text-white` + "fy" en `text-secondary-fixed-dim`

### Bordes:

- Clase `.border-thin` = `border-width: 0.5px` (definida en index.html)
- Border radius: `rounded-lg` (8px), `rounded-xl` (12px)

## Tono de comunicación

- **Directo**: frases cortas, sin rodeos
- **Cercano**: tuteo, lenguaje cotidiano
- **Concreto**: siempre con números y datos reales
- **Calmado**: sin exclamaciones dobles, sin emojis

### Nunca usar:

- "Transformación digital", "solución integral", "ecosistema", "escalable", "disruptivo"
- Peso bold (700) en tipografía
- Degradados, sombras, fotos de stock genéricas

### Frases signature (usar donde encajen):

1. "Yo me encargo del papeleo. Tú del negocio."
2. "Sin jerga. Sin complicaciones. Yo me encargo de todo."
3. "Cada mes que pasa sin automatizar, te cuesta dinero."
4. "Yo no monto algo y desaparezco. Yo me quedo."
5. "Tu negocio se merece la misma tecnología que los grandes."

## Oferta comercial

### Piloto Automático — 2 fases:

**Fase 1 · Construcción (meses 1-6):**
- Esencial: 297€/mes × 4 meses → Fase 2: 127€/mes
- Completo: 497€/mes × 6 meses → Fase 2: 197€/mes (oferta principal)
- Total: 797€/mes × 6 meses → Fase 2: 297€/mes

**Fase 2 · Mantenimiento (mes 7+):**
- Monitorización, reparación, optimización, soporte

**Garantía**: si en 30 días no ahorra 10 horas, devolución del 100%.

## Datos clave para usar en contenido

- Pymes españolas pierden hasta 10 días/mes en admin (Informe Qonto 2026)
- 40-60 horas/mes en papeleo
- 1.250€/mes perdidos (a 25€/hora)
- 15.000€/año en tiempo que no genera nada
- Ahorro neto con Nitefy: +753€/mes desde el primer mes
- Empleado admin media jornada: 900-1.200€/mes
- Primera automatización lista en 14 días

## Comandos útiles

```bash
npm install          # Instalar dependencias
npm run dev          # Servidor de desarrollo (localhost:5173)
npm run build        # Build de producción (genera /dist)
```
