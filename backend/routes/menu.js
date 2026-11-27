const express = require("express");
const db = require("../db");

const router = express.Router();

// Get all available menu items, with the category name
router.get("/menu", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT menu_items.id, menu_items.name, menu_items.description, menu_items.price, menu_items.image, categories.name AS category " +
      "FROM menu_items JOIN categories ON menu_items.category_id = categories.id " +
      "WHERE menu_items.is_available = 1"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Could not load menu" });
  }
});

module.exports = router;
