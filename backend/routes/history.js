// // routes/history.js
// const express = require("express");
// const router = express.Router();
// const ChartHistory = require("../models/ChartHistory");
// const { protect } = require("../middleware/authMiddleware");

// // Save chart history (requires login)
// router.post("/save", protect, async (req, res) => {
//   try {
//     console.log("📥 Incoming request body:", req.body);
//     console.log("🔐 Authenticated user ID:", req.user.id);

//     const { title, chartType, xValue, yValue, zValue, imageUrl } = req.body;

//     const newHistory = new ChartHistory({
//       user: req.user.id,
//       title,
//       chartType,
//       xValue,
//       yValue,
//       zValue,
//       imageUrl,
//       createdOn: new Date()
//     });

//     const saved = await newHistory.save();
//     console.log("✅ Saved document:", saved);

//     res.status(201).json({ message: "Chart history saved" });
//   } catch (err) {
//     console.error("❌ Failed to save chart:", err);
//     res.status(500).json({ message: "Failed to save chart history", error: err });
//   }
// });


// // Get all chart history for the logged-in user
// router.get("/user", protect, async (req, res) => {
//   try {
//     const history = await ChartHistory.find({ user: req.user.id }).sort({ createdAt: -1 });
//     res.json(history); // ✅ This must be an array
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // ✅ DELETE a specific chart by ID
// router.delete("/delete/:id", protect, async (req, res) => {
//   try {
//     const history = await ChartHistory.findOneAndDelete({
//       _id: req.params.id,
//       user: req.user.id, // make sure only the chart owner can delete
//     });

//     if (!history) {
//       return res.status(404).json({ message: "Chart not found or unauthorized" });
//     }

//     res.json({ message: "Chart deleted successfully" });
//   } catch (err) {
//     console.error("❌ Error deleting chart:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });


// module.exports = router;



// routes/history.js
const express = require("express");
const router = express.Router();
const ChartHistory = require("../models/ChartHistory");
const FileUpload = require("../models/FileUpload"); 
const { protect } = require("../middleware/authMiddleware");

// ✅ Save chart history
router.post("/save", protect, async (req, res) => {
  try {
    console.log("📥 Incoming request body:", req.body);
    console.log("🔐 Authenticated user ID:", req.user.id);

    const { title, chartType, xValue, yValue, zValue, imageUrl } = req.body;

    const newHistory = new ChartHistory({
      user: req.user.id,
      title,
      chartType,
      xValue,
      yValue,
      zValue,
      imageUrl,
      createdOn: new Date()
    });

    const saved = await newHistory.save();
    console.log("✅ Saved document:", saved);

    res.status(201).json({ message: "Chart history saved" });
  } catch (err) {
    console.error("❌ Failed to save chart:", err);
    res.status(500).json({ message: "Failed to save chart history", error: err });
  }
});

// ✅ Get all chart history for logged-in user
router.get("/user", protect, async (req, res) => {
  try {
    const history = await ChartHistory.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Delete chart history by ID
router.delete("/delete/:id", protect, async (req, res) => {
  try {
    const history = await ChartHistory.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!history) {
      return res.status(404).json({ message: "Chart not found or unauthorized" });
    }

    res.json({ message: "Chart deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting chart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Get dashboard stats for the user
router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalFiles = await FileUpload.countDocuments({ user: userId });
    const totalCharts = await ChartHistory.countDocuments({ user: userId });

    res.json({
      totalFiles,
      totalCharts,
      savedCharts: totalCharts, // Same as totalCharts for now
    });
  } catch (error) {
    console.error("❌ Dashboard stats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
