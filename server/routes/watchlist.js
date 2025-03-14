const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

module.exports = (pool) => {
  // Check if movie is in user's watchlist
  router.get("/status/:movieId", auth, async (req, res) => {
    try {
      const [rows] = await pool
        .promise()
        .query(
          "SELECT * FROM user_watchlist WHERE user_id = ? AND movie_id = ?",
          [req.user.id, req.params.movieId],
        );

      res.json({ isInWatchlist: rows.length > 0 });
    } catch (error) {
      console.error("Error checking watchlist status:", error);
      res.status(500).json({ error: "Failed to check watchlist status" });
    }
  });

  // Add movie to watchlist
  router.post("/movies", auth, async (req, res) => {
    const { movieId } = req.body;

    try {
      await pool
        .promise()
        .query(
          "INSERT IGNORE INTO user_watchlist (user_id, movie_id) VALUES (?, ?)",
          [req.user.id, movieId],
        );

      res.json({ message: "Movie added to watchlist" });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      res.status(500).json({ error: "Failed to add movie to watchlist" });
    }
  });

  // Remove movie from watchlist
  router.delete("/movies/:movieId", auth, async (req, res) => {
    try {
      await pool
        .promise()
        .query(
          "DELETE FROM user_watchlist WHERE user_id = ? AND movie_id = ?",
          [req.user.id, req.params.movieId],
        );

      res.json({ message: "Movie removed from watchlist" });
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      res.status(500).json({ error: "Failed to remove movie from watchlist" });
    }
  });

  router.get("/movies", auth, async (req, res) => {
    try {
      const [rows] = await pool.promise().query(
        `SELECT uw.*,
                  uw.movie_id as id,
                  uw.added_at as addedAt
           FROM user_watchlist uw
           WHERE uw.user_id = ?
           ORDER BY uw.added_at DESC`,
        [req.user.id],
      );

      res.json(rows);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      res.status(500).json({ error: "Failed to fetch watchlist" });
    }
  });
  return router;
};
