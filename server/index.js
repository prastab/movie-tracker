const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
const path = require("path");

// Middleware
app.use(cors());
app.use(express.json());


// Database connection pool
pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  connectionLimit: 10,
});

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Successfully connected to the database");
  connection.release();
});

// Routes
const authRoutes = require("./routes/auth");
const watchlistRoutes = require("./routes/watchlist");
const ratingsRoutes = require("./routes/ratings");
app.use("/api/ratings", ratingsRoutes(pool));
app.use("/api/auth", authRoutes(pool));
app.use("/api/watchlist", watchlistRoutes(pool));

// Get Watchlists API Endpoint
app.get("/api/watchlists", (req, res) => {
  pool.query("SELECT * FROM user_watchlist", (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

app.use(express.static(path.join(__dirname, "public", "dist")));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
