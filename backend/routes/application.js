// backend/routes/application.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  getApplicationById,
  getApplications,
  getRecruiterSummary,
  exportRecruiterApplications
} = require("../controllers/applicationController");
router.get("/recruiter/summary", protect, getRecruiterSummary);
router.get("/recruiter/export", protect, exportRecruiterApplications);
router.get("/", protect, getApplications);
router.post("/apply/:jobId", protect, applyToJob);
router.get("/me", protect, getMyApplications);
router.get("/job/:jobId", protect, getApplicantsForJob); // recruiter/admin
router.put("/:id/status", protect, updateApplicationStatus);
router.get("/:id", protect, getApplicationById);

module.exports = router;
