// backend/routes/job.js
const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  getRecruiterJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.get("/", getJobs);
router.get("/:id", getJobById);

// Protected (recruiter/admin)
router.post("/", protect, createJob);
router.get("/recruiter/me", protect, getRecruiterJobs);

// Update / delete specific job
router.patch("/:id", protect, updateJob);
//router.put("/:id", protect, updateJob);

router.delete("/:id", protect, deleteJob);

module.exports = router;

