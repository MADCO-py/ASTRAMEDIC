# Astramedic — sitio web

Atención médica y veterinaria a domicilio en todo el departamento de Guatemala. Dos modos en la misma página: **Personas** (`#/personas`) y **Mascotas** (`#/mascotas`).

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
