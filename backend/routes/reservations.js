const express = require("express");
const db = require("../db");
const { requireLogin } = require("../middleware/auth");

const router = express.Router();

// Book a table (the user must be logged in)
router.post("/reservations", requireLogin, async (req, res) => {
  const { date, time, guests } = req.body;
  const guestCount = Number(guests);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ message: "Please choose a valid date" });
  }

  if (!/^\d{2}:\d{2}/.test(time)) {
    return res.status(400).json({ message: "Please choose a valid time" });
  }

  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20) {
    return res.status(400).json({ message: "Guests must be between 1 and 20" });
  }

  // The date must not be in the past
  const today = new Date().toISOString().split("T")[0];

  if (date < today) {
    return res.status(400).json({ message: "The date cannot be in the past" });
  }

  try {
    await db.query(
      "INSERT INTO reservations (user_id, reservation_date, reservation_time, guests) VALUES (?, ?, ?, ?)",
      [req.user.id, date, time, guestCount]
    );

    res.status(201).json({ message: "Table request sent" });
  } catch (error) {
    res.status(500).json({ message: "Could not save the reservation" });
  }
});

// Get the reservations of the logged-in user, newest date first
router.get("/reservations/my", requireLogin, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, DATE_FORMAT(reservation_date, '%Y-%m-%d') AS date, TIME_FORMAT(reservation_time, '%H:%i') AS time, guests, status " +
      "FROM reservations WHERE user_id = ? ORDER BY reservation_date DESC, reservation_time DESC",
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Could not load your reservations" });
  }
});

module.exports = router;
