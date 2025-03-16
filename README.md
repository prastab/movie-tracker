# MovieTracker

MovieTracker is a web app that helps you track, rate, and manage your movie watchlist. Built with Express.js, Vue 3, and MySQL.
The website is deployed [here.](https://movie-tracker-production-923f.up.railway.app/)

---

## Main Features

**User Authentication:** Secure registration, login, and JWT authentication.

**Movie Tracking:** Rate movies, update/delete ratings, and manage your watchlist.

**Modern UI:** Vue 3 + Tailwind CSS for a responsive, smooth experience.

**Backend API:** Express.js RESTful API with secure MySQL database integration.

**Extras:** TMDB API integration and easy setup with database and build scripts.

---

## Project Structure
```
movie-tracker/
├── server/
│   ├── index.js              // Main Express server file
│   ├── setup-db.js           // Script to set up the database tables
│   ├── schema.sql            // Database schema definitions
│   ├── routes/               // API routes
│   └── middleware/           // JWT authentication middleware
└── frontend/
  ├── src/
       ├── main.ts
       ├── App.vue           // Root Vue component
       ├── assets/
       ├── components/       // Reusable Vue components
       ├── composables/
       ├── lib/              // API configuration and utility functions
       ├── router/           // Vue Router
       ├── stores/           // Pinia store
       ├── types/
       └── views/            // Vue view components (pages)
```
---

## Setup Instructions

### Prerequisites

- Node.js (v14 or above)
- MySQL server
- TMDB API key (get it from [TMDB website](https://www.themoviedb.org/documentation/api))

## Environment Variables Setup

Before running the project, you need to create environment variable files for both your server and client.

1. **Server Configuration** (create `.env` in `/server`):

```
MYSQL_HOST=localhost
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=your_database_name   # Make sure this database exists in your MySQL instance
MYSQL_PORT=3306

# JWT Secret is required for signing tokens.
# To generate a secure random JWT secret using Node.js, run:
#   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
JWT_SECRET=your_generated_jwt_secret

```

Make sure you generated the **JWT secret** using the provided command.

2. **Frontend Configuration** (create `.env` in `/frontend`):

```
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_API_URL=http://localhost:3000/api
```
Look at the `.env.example` file for reference.

## Step-by-Step Setup and Running Instructions

### 1. Install Dependencies

At the project root, run the following command to install dependencies for both the server and frontend:

```bash
npm install
```

This installs all required dependencies for both server and frontend.

> If you prefer to install dependencies separately, run: `npm install` in each folder.

### 2. Database Setup

• Make sure your MySQL server running and create database matching the name in your `.env` (MYSQL_DATABASE).
• The file `schema.sql` (inside the `server` folder) contains the necessary SQL statements to create tables for users, sessions, watchlist, and ratings.
• To initialize the database tables, run:

```bash
npm run db-init
```
> This command switches to the `server` folder and executes `node setup-db.js` to create all database tables.

### 3. Running the Server and Frontend Concurrently

You can start both the server and the frontend at the same time using the provided `dev` script:

```bash
npm run dev
```

This command uses the `concurrently` package to run both `npm run server` and `npm run client` in parallel.

## Build Scripts
The project has build scripts so that you don't have to go to each folder to perform different commands.
The base package.json includes these useful scripts:
- `npm run dev` – Runs both the server and client concurrently.
- `npm run server` – Starts the server with Nodemon.
- `npm run client` – Starts the Vite development server for the frontend.
- `npm run db-init` – Initializes the database tables using `server/setup-db.js`.
- `npm run build` – Builds the frontend and then copies the build output into the server’s `public` folder so the backend can serve the static files.

## Summary

MovieTracker project has the following features:
- **Backend:** Built with Express.js and MySQL, featuring a complete RESTful API for CRUD operations.
- **Frontend:** Developed in Vue 3 + TypeScript (using Vite), ensuring a clean, responsive, and intuitive UI.
- **Authentication:** Includes user registration, JWT-based authentication, and secure data handling.
