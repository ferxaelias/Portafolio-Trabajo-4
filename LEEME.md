# Portafolio de Henry Alvarenga

Sitio estático: HTML, CSS y JavaScript sin dependencias ni proceso de compilación.

## Cómo abrirlo

Haz doble clic en `index.html`; funciona directamente desde el disco en cualquier navegador moderno. También puede publicarse tal cual en cualquier alojamiento estático, manteniendo la estructura de carpetas.

## Carpetas

- `css/` — `styles.css`: estilos y diseño adaptable.
- `js/` — `main.js`: menú móvil, pestañas de habilidades, ventana «Sobre mí» y copia del teléfono.
- `assets/` — ilustraciones (`terminal.svg`, `cloudynow.svg`), `favicon.svg` y `fonts/` con las fuentes Space Grotesk y JetBrains Mono (licencia OFL incluida).

## Cambiar enlaces y datos

Todo está en `index.html`:

- **Facebook:** el enlace actual (`https://www.facebook.com/search/people/?q=Nando%20Elias`) es una búsqueda provisional, porque solo se conoce el nombre. Busca `data-provisional` en la sección «Conectemos», reemplaza el `href` por la URL directa del perfil y cambia la etiqueta «Facebook · Buscar perfil» por «Facebook».
- **Instagram y TikTok:** edita el `href` y el texto de su tarjeta en la misma sección.
- **Proyecto CloudyNow:** el `href` del botón «Abrir CloudyNow» está en la sección «Proyectos».
- **Teléfono:** cambia `tel:+50372558351` y el texto `+503 7255 8351`; el número que se copia está en `js/main.js` (constante `PHONE_DISPLAY`).

## Teléfono

El enlace usa `tel:`, así que el sistema operativo o el navegador decide qué hacer (abrir el marcador, una app de llamadas, etc.). Como el sitio no puede saber si eso ocurre, al tocar el enlace también se intenta copiar el número como respaldo. Junto al enlace hay un botón «Copiar» independiente. Si el navegador bloquea la copia, se muestra el número seleccionado para copiarlo a mano.
