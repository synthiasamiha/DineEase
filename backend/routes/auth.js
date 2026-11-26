const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { requireLogin } = require("../middleware/auth");

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

// Log in with email and password
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Wrong email or password" });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Wrong email or password" });
    }

    // Make a token that proves who the user is (valid for 7 days)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Could not log in" });
  }
});

// Show who is logged in (also used to test the login check)
router.get("/auth/me", requireLogin, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, phone, role FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Could not load the user" });
  }
});

module.exports = router;