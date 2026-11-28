const express = require("express");
const db = require("../db");

const router = express.Router();

// Save a message from the contact form (anyone can send one)
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email and message are required" });
  }

  if (!email.includes("@") || !email.includes(".")) {
    return res.status(400).json({ message: "Please enter a valid email" });
  }

  if (message.length < 5) {
    return res.status(400).json({ message: "The message is too short" });
  }

  try {
    await db.query(
      "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    res.status(201).json({ message: "Message sent" });
  } catch (error) {
    res.status(500).json({ message: "Could not send the message" });
  }
});

module.exports = router;
