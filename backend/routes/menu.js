const express = require("express");
const db = require("../db");

const router = express.Router();

// Get all available menu items
router.get("/menu", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM menu_items WHERE is_available = 1");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Could not load menu" });
  }
});

module.exports = router;