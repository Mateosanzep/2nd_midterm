# Super Heroes catalog (2nd midterm)

Pequeña aplicación hecha con **Node.js**, **Express** y **EJS** para repasar el consumo de la [Superhero API](https://akabab.github.io/superhero-api/api/). Muestra un catálogo con más de 700 personajes y permite entrar a la ficha de cada uno con sus datos principales.

## Requisitos previos

- Node.js 18 o superior
- npm (viene con Node)

## Cómo correr el proyecto

```bash
npm install
npm run start
```

La app queda escuchando en `http://localhost:3000`. También hay un script `npm run dev` por si quieres ver los cambios en caliente con **nodemon**.

## Qué hay en la app

- `/` página de bienvenida con info del proyecto.
- `/catalog` catálogo completo con tarjetas de héroes y un buscador en la barra superior.
- `/heroes/:id` ficha individual con datos, alias, stats y botones para pasar al héroe anterior o siguiente.

Todo el contenido se obtiene del archivo `all.json` de la Superhero API y se guarda en caché unos minutos para no bombardear la API.

## Tecnologías usadas

- Express 5 + EJS para las vistas.
- Bootstrap 5 para estilos base + algunos estilos propios en `public/style.css`.
- `https` nativo de Node para hacer las peticiones.

## Nota sobre IA

Este README y varias cosas del código se realizaron con ayuda de ChatGPT. Por ejemplo, el diseño se realizaron los primeros borradores por mi y despues con la ayuda de la IA se le dio un mejor formato y consistente dentro de todas las paginas. El contenido completo de `homepage.ejs` fue proporcionado por la IA con un promt pidiendole que me de informacion acerca de la API que se pueda usar para dar una introducción. Tambien se uso para la ayuda y explicacion de ciertas funciones de node, las cuales no tenia conocimiento.
