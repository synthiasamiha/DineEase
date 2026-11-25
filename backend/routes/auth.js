const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

// Create a new customer account
router.post("/auth/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    // Check if this email is already used
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(400).json({ message: "This email is already registered" });
    }

    // Never store the plain password, store a hash
    const passwordHash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)",
      [name, email, phone || null, passwordHash]
    );

    res.status(201).json({ message: "Account created" });
  } catch (error) {
    res.status(500).json({ message: "Could not create the account" });
  }
});

module.exports = router;