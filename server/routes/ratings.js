const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

module.exports = (pool) => {
  // Get user's rating for a movie
  router.get("/movies/:movieId", auth, async (req, res) => {
    try {
      const [rows] = await pool
        .promise()
        .query(
          "SELECT rating, review, created_at, updated_at FROM user_ratings WHERE user_id = ? AND movie_id = ?",
          [req.user.id, req.params.movieId],
        );

      res.json(rows[0] || { rating: 0, review: "" });
    } catch (error) {
      console.error("Error fetching rating:", error);
      res.status(500).json({ error: "Failed to fetch rating" });
    }
  });

  // Get all user's rated movies
  router.get("/movies", auth, async (req, res) => {
    try {
      const [rows] = await pool
        .promise()
        .query(
          "SELECT movie_id, rating, review, created_at, updated_at FROM user_ratings WHERE user_id = ? ORDER BY updated_at DESC",
          [req.user.id],
        );

      res.json(rows);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ error: "Failed to fetch ratings" });
    }
  });

  // Rate a movie
  router.post("/movies/:movieId", auth, async (req, res) => {
    const { rating, review = "" } = req.body;

    try {
      await pool.promise().query(
        `INSERT INTO user_ratings (user_id, movie_id, rating, review)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE rating = ?, review = ?, updated_at = CURRENT_TIMESTAMP`,
        [req.user.id, req.params.movieId, rating, review, rating, review],
      );

      res.json({ message: "Rating saved successfully" });
    } catch (error) {
      console.error("Error saving rating:", error);
      res.status(500).json({ error: "Failed to save rating" });
    }
  });

  // Delete a rating
  router.delete("/movies/:movieId", auth, async (req, res) => {
    try {
      await pool
        .promise()
        .query("DELETE FROM user_ratings WHERE user_id = ? AND movie_id = ?", [
          req.user.id,
          req.params.movieId,
        ]);

      res.json({ message: "Rating removed successfully" });
    } catch (error) {
      console.error("Error removing rating:", error);
      res.status(500).json({ error: "Failed to remove rating" });
    }
  });

  return router;
};
