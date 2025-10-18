# Super Heroes catalog (2nd midterm)

Small application built with **Node.js**, **Express**, and **EJS** to revisit the consumption of the [Superhero API](https://akabab.github.io/superhero-api/api/). It shows a catalog with more than 700 characters and lets you open each profile with its main data.

## Prerequisites

- Node.js 18 or higher
- npm (included with Node)

## How to run the project

```bash
npm install
npm run start
```

The app listens on `http://localhost:3000`. There's also an `npm run dev` script if you want hot reloading with **nodemon**.

## What's in the app

- `/` welcome page with project info.
- `/catalog` full catalog with hero cards and a search bar at the top.
- `/heroes/:id` individual profile with data, aliases, stats, and buttons to move to the previous or next hero.

All content is fetched from the Superhero API `all.json` file and cached for a few minutes to avoid spamming the API.

## Technologies used

- Express 5 + EJS for the views.
- Bootstrap 5 for base styles plus some custom styles in `public/style.css`.
- Node's native `https` module to make the requests.

## Note about AI

This README and several parts of the code were created with help from ChatGPT. For example, I drafted the initial design and then used AI to give it a more polished and consistent format across all pages. The complete content of `homepage.ejs` was provided by the AI with a prompt asking for information about the API to use as an introduction. It was also used to explain certain Node functions I wasn't familiar with.
