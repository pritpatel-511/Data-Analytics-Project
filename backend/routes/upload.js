// routes/upload.js
const express = require("express");
const router = express.Router(); // ✅ REQUIRED!
const { protect } = require("../middleware/authMiddleware");
const FileUpload = require("../models/FileUpload");

router.post("/upload", protect, async (req, res) => {
  const { fileName } = req.body;

  try {
    await FileUpload.findOneAndUpdate(
      { user: req.user.id, fileName },
      { uploadedOn: Date.now() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "File upload tracked successfully." });
  } catch (error) {
    res.status(500).json({ message: "Tracking failed", error });
  }
});

module.exports = router;
