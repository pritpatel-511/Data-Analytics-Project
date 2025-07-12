const mongoose = require("mongoose");

const chartHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  chartType: { type: String, required: true },
  xValue: { type: [mongoose.Schema.Types.Mixed], required: true },
  yValue: { type: [mongoose.Schema.Types.Mixed], required: true },
  zValue: { type: [mongoose.Schema.Types.Mixed] },
  createdOn: { type: Date, default: Date.now },
  imageUrl: { type: String }
}, {
  timestamps: true // ✅ correct usage
});

module.exports = mongoose.model("ChartHistory", chartHistorySchema);
