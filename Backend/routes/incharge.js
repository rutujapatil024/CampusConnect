// routes/incharge.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Incharge = require("../models/Incharge");

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify token
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization failed" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.inchargeId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// GET /api/incharge/profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const incharge = await Incharge.findById(req.inchargeId).select("-password");
    if (!incharge) return res.status(404).json({ message: "Incharge not found" });
    res.json(incharge);
  } catch (err) {
    console.error("Error fetching incharge profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
