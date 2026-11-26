# Astramedic — sitio web

Atención médica y veterinaria a domicilio en la Ciudad de Guatemala. Dos modos en la misma página: **Personas** (`#/personas`) y **Mascotas** (`#/mascotas`).

## Ver en local
```bash
npm install
npm run dev
```
Abre http://localhost:5173

## Editar contenido
Todo el texto, precios, preguntas del chatbot y contacto están en `src/data.js`.
- `CONTACT.whatsapp`: número con código de país (ej. `50212345678`). Mientras esté vacío, los botones abren el correo.
- `CONTACT.socials`: URL de redes sociales (las vacías no se muestran).

## Publicar en GitHub Pages
1. En GitHub: Settings → Pages → Source: **GitHub Actions**.
2. Haz push a `main`; el workflow `.github/workflows/deploy.yml` compila y publica.

## Dominio propio, vista previa y Google
Todo se configura al inicio de `vite.config.js`:
- `SITE_URL`: dirección completa del sitio (ej. `https://www.astramedic.com`). Se usa en la vista previa al compartir, el sitemap y los datos para Google.
- `CUSTOM_DOMAIN`: el dominio sin `https://` (ej. `www.astramedic.com`). Genera el archivo `CNAME` para GitHub Pages.
- `GOOGLE_VERIFICATION`: código de Google Search Console (opcional).

Al compilar se generan solos: `robots.txt`, `sitemap.xml`, datos estructurados (schema.org) y el contenido en HTML que lee Google.
La imagen para compartir es `public/og-image.png` (1200×630).
