// backend/routes/resume.js
const express = require("express");
const router = express.Router();
const { uploadResume,getMyResume } = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Protected route → only logged-in student can upload
router.get("/me", protect, getMyResume);
router.post("/upload", protect, upload.single("resume"), uploadResume);

module.exports = router;
