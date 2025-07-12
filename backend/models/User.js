// const mongoose = require("mongoose");

// const activityLogSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ["login", "logout", "chart_created"],
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
//   details: String,
// });

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   theme: {
//     type: String,
//     enum: ["light", "dark"],
//     default: "light",
//   },
//   role: {
//     type: String,
//     enum: ["user", "admin"],
//     default: "user",
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   activityLogs: [activityLogSchema], // ✅ For login/chart tracking
// });

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

// Schema to track user activity (timeline logs)
const activityLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["login", "logout", "chart_created"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: String,
    default: "",
  },
}, { _id: false }); // 👈 Optional: avoids extra `_id` per subdocument

// Main User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    enum: ["light", "dark"],
    default: "light",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  activityLogs: [activityLogSchema], // ✅ User timeline feature
});

module.exports = mongoose.model("User", userSchema);
