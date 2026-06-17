# Nitefy — Landing Page

Tu negocio funcionando. Tú viviendo.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

## Despliegue en Netlify

### Opción A: Desde GitHub (recomendado)

1. Sube este proyecto a un repositorio en GitHub
2. Ve a [app.netlify.com](https://app.netlify.com) y haz login con GitHub
3. Click en "Add new site" → "Import an existing project" → selecciona tu repo
4. Netlify detecta la configuración automáticamente (Vite + React)
5. Click en "Deploy site"
6. Tu web estará online en ~60 segundos

### Opción B: Despliegue manual (sin GitHub)

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

### Conectar dominio personalizado (nitefy.es)

1. En Netlify: Site settings → Domain management → Add custom domain
2. Escribe `nitefy.es` y confirma
3. Netlify te dará los DNS nameservers (ej: dns1.p01.nsone.net)
4. Ve a tu registrador de dominio y cambia los nameservers por los de Netlify
5. Espera 24-48h a que se propaguen los DNS
6. Netlify generará el certificado SSL automáticamente

## Estructura del proyecto

```
nitefy-web/
├── public/
│   └── favicon.svg          # Favicon Nf
├── src/
│   ├── App.jsx              # Componente raíz
│   ├── NitefyLanding.jsx    # Landing page completa
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── index.html               # HTML con meta tags SEO
├── netlify.toml             # Configuración de Netlify
└── package.json
```

## Personalización

- **Colores**: definidos en el objeto COLORS al inicio de NitefyLanding.jsx
- **Textos**: directamente en el JSX del componente
- **Meta tags SEO**: en index.html
- **Favicon**: public/favicon.svg
