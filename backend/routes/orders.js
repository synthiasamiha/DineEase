const express = require("express");
const db = require("../db");
const { requireLogin } = require("../middleware/auth");

const router = express.Router();

// Place a new order (the price is always read from the database, not from the browser)
router.post("/orders", requireLogin, async (req, res) => {
  const { items, address, phone } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Your cart is empty" });
  }

  if (!address || !phone) {
    return res.status(400).json({ message: "Address and phone are required" });
  }

  // Collect the ids of the ordered items
  const ids = [];

  for (let i = 0; i < items.length; i++) {
    ids.push(items[i].menu_item_id);
  }

  try {
    const [menuRows] = await db.query(
      "SELECT id, price FROM menu_items WHERE is_available = 1 AND id IN (?)",
      [ids]
    );

    // Work out each line and the total
    let total = 0;
    const lines = [];

    for (let i = 0; i < items.length; i++) {
      const quantity = Number(items[i].quantity);
      let menuItem = null;

      for (let j = 0; j < menuRows.length; j++) {
        if (menuRows[j].id === Number(items[i].menu_item_id)) {
          menuItem = menuRows[j];
        }
      }

      if (menuItem === null) {
        return res.status(400).json({ message: "One of the items is not available" });
      }

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        return res.status(400).json({ message: "Quantity must be between 1 and 20" });
      }

      const price = Number(menuItem.price);
      total = total + price * quantity;
      lines.push({ menuItemId: menuItem.id, quantity: quantity, price: price });
    }

    // Save the order and its items together
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        "INSERT INTO orders (user_id, total, address, phone) VALUES (?, ?, ?, ?)",
        [req.user.id, total, address, phone]
      );

      for (let i = 0; i < lines.length; i++) {
        await connection.query(
          "INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)",
          [result.insertId, lines[i].menuItemId, lines[i].quantity, lines[i].price]
        );
      }

      await connection.commit();
      res.status(201).json({ message: "Order placed", orderId: result.insertId, total: total });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ message: "Could not place the order" });
  }
});

// Get the orders of the logged-in user, newest first
router.get("/orders/my", requireLogin, async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT id, total, status, address, phone, created_at FROM orders WHERE user_id = ? ORDER BY id DESC",
      [req.user.id]
    );

    // Add the items to each order
    for (let i = 0; i < orders.length; i++) {
      const [items] = await db.query(
        "SELECT menu_items.name, order_items.quantity, order_items.price " +
        "FROM order_items JOIN menu_items ON order_items.menu_item_id = menu_items.id " +
        "WHERE order_items.order_id = ?",
        [orders[i].id]
      );
      orders[i].items = items;
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not load your orders" });
  }
});

module.exports = router;
