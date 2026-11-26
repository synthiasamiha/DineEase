const jwt = require("jsonwebtoken");

// Check that the request has a valid login token
function requireLogin(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Please log in first" });
  }

  // The header looks like: Bearer <token>
  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: "Login expired or invalid" });
  }
}

// Allow only admins (always use it after requireLogin)
function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
}

module.exports = { requireLogin, requireAdmin };