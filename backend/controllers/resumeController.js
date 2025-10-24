// backend/controllers/resumeController.js
const User = require("../models/User");

// POST /api/resume/upload
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded or invalid format" });
    }

    // Save path to user record
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.resumeUrl = req.file.path; // local path e.g., uploads/resume-123.pdf
    await user.save();

    res.json({ message: "Resume uploaded successfully", resumeUrl: user.resumeUrl });
  } catch (err) {
    console.error("uploadResume error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
const getMyResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("resumeUrl resumeName email name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resumeUrl) {
      return res.status(404).json({ message: "No resume uploaded yet" });
    }

    res.json({
      name: user.name,
      email: user.email,
      resumeUrl: user.resumeUrl,
      resumeName: user.resumeName || "Resume.pdf",
    });
  } catch (err) {
    console.error("getMyResume error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { uploadResume, getMyResume };
