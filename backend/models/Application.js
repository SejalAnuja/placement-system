// backend/models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  status: {
    type: String,
    enum: ["Applied", "Shortlisted", "Rejected", "Selected"],
    default: "Applied",
  },
  appliedAt: { type: Date, default: Date.now },
  coverLetter: { type: String, default: "" }
});

// Prevent same student applying to same job more than once
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);

