const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token or not authorized" });
  }
};

module.exports = adminAuth;
