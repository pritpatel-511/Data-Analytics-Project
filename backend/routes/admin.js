const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ChartHistory = require("../models/ChartHistory");
const FileUpload = require("../models/FileUpload");

// Admin Auth Middleware
const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ GET: All users (with chart/file count)
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      const chartCount = await ChartHistory.countDocuments({ user: user._id });
      const fileCount = await FileUpload.countDocuments({ user: user._id });
      return {
        ...user._doc,
        chartCount,
        fileCount,
      };
    }));
    res.json(enrichedUsers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ✅ GET: User activity logs (for timeline page)
router.get("/user/:id/logs", isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.activityLogs || []);
});

// ✅ PATCH: Block user
router.patch("/block/:id", isAdmin, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: "User blocked" });
});

// ✅ PATCH: Unblock user
router.patch("/unblock/:id", isAdmin, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: true });
  res.json({ message: "User unblocked" });
});

// ✅ DELETE: Remove user
router.delete("/delete/:id", isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

// ✅ GET: User uploaded files (for activity page)
router.get("/files/:id", isAdmin, async (req, res) => {
  try {
    const files = await FileUpload.find({ user: req.params.id }).sort({ uploadedOn: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch files" });
  }
});

// ✅ GET: User chart history (for activity page)
router.get("/charts/:id", isAdmin, async (req, res) => {
  try {
    const charts = await ChartHistory.find({ user: req.params.id }).sort({ createdOn: -1 });
    res.json(charts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch charts" });
  }
});

module.exports = router;

router.get("/stats", isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCharts = await ChartHistory.countDocuments();
    const totalFiles = await FileUpload.countDocuments();

    res.json({ totalUsers, totalCharts, totalFiles });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});
