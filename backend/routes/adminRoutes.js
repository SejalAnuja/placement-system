const express = require("express");
const router = express.Router();
const { getAllJobs, deleteJob ,getAllApplications, updateApplicationStatus } = require("../controllers/adminController");
const { getAllUsers, deleteUser } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getPlatformStats,
} = require("../controllers/adminController");
const {
  exportUsersCSV,
  exportJobsCSV,
  exportApplicationsCSV,
} = require("../controllers/adminController");
const {
  getAdminSummary,
  getTopRecruiters,
} = require("../controllers/adminController");

router.get("/summary", protect, adminOnly, getAdminSummary);
router.get("/top-recruiters", protect, adminOnly, getTopRecruiters);
router.get("/export/users", protect, adminOnly, exportUsersCSV);
router.get("/export/jobs", protect, adminOnly, exportJobsCSV);
router.get("/export/applications", protect, adminOnly, exportApplicationsCSV);
router.get("/jobs", protect, adminOnly, getAllJobs);
router.get("/stats", protect, adminOnly, getPlatformStats);
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/jobs/:id", protect, adminOnly, deleteJob);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.get("/applications", protect, adminOnly, getAllApplications);
router.patch(
  "/applications/:id/status",
  protect,
  adminOnly,
  updateApplicationStatus
);


module.exports = router;
