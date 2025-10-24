// backend/models/Job.js
// backend/models/Job.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, default: "" },
  company: { type: String, required: true, index: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: { type: String, default: "Remote" },
  recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 👈 This line is the key fix
      required: true,
    },
  stipend: { type: String, default: "" }, // e.g. "10k - 15k" or "Unpaid"
  skills: [{ type: String }],             // e.g. ["React", "Node.js"]
  deadline: { type: Date },               // application deadline
  isRemote: { type: Boolean, default: true },
  status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);
