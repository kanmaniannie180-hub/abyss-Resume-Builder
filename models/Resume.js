const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  phone: String,
  summary: String
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);
