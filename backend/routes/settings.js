// routes/settings.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// Get user info
router.get("/user", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("name email theme");
  res.json(user);
});

// Update name
router.put("/update-name", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.name = req.body.name;
  await user.save();
  res.json({ message: "Name updated" });
});

// Change password
router.put("/change-password", protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password updated" });
});

// Change theme
router.put("/theme", protect, async (req, res) => {
  const { theme } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { theme }, { new: true });
  res.json({ message: "Theme updated", theme: user.theme });
});

module.exports = router;
