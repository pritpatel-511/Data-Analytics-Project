const mongoose = require("mongoose");

const fileUploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  fileName: { type: String, required: true },
  uploadedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FileUpload", fileUploadSchema);
