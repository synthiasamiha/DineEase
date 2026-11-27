const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const menuRoutes = require("./routes/menu");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", menuRoutes);
app.use("/api", authRoutes);
app.use("/api", orderRoutes);

// Test route to check that the server is running
app.get("/", (req, res) => {
  res.send("DineEase server is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log("Server running on port " + PORT);

  // Check the database connection when the server starts
  try {
    await db.query("SELECT 1");
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection failed: " + error.message);
  }
});
