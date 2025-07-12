// controllers/historyController.js
const ChartHistory = require('../models/ChartHistory');
// prit
exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await ChartHistory.find({ user: userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching history' });
  }
};
const user = await User.findById(req.user.id);
if (user) {
  user.activityLogs = user.activityLogs || [];
  user.activityLogs.push({
    type: "chart_created",
    timestamp: new Date(),
    details: `Created chart titled "${title}"`,
  });
  await user.save();
}
