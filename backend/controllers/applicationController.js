// backend/controllers/applicationController.js
const Application = require("../models/Application");
//import Application from "../models/Application";
const Job = require("../models/Jobs");
const { Parser } = require("json2csv")
 
const exportRecruiterApplications = async (req, res) => {
  try {
    if (req.user.role !== "Recruiter" && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 1️⃣ Get all jobs posted by this recruiter
    const jobs = await Job.find({ postedBy: req.user._id }).select("_id title company");

    if (jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for this recruiter" });
    }

    const jobIds = jobs.map((job) => job._id);

    // 2️⃣ Get all applications for these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("jobId", "title company")
      .populate("studentId", "name email resumeUrl")
      .sort({ appliedAt: -1 });

    if (applications.length === 0) {
      return res.status(404).json({ message: "No applications found" });
    }

    // 3️⃣ Prepare CSV fields
    const csvData = applications.map((app) => ({
      JobTitle: app.jobId?.title || "N/A",
      Company: app.jobId?.company || "N/A",
      ApplicantName: app.studentId?.name || "N/A",
      ApplicantEmail: app.studentId?.email || "N/A",
      Status: app.status,
      AppliedAt: new Date(app.appliedAt).toLocaleString(),
      ResumeLink: app.studentId?.resumeUrl || "",
    }));

    // 4️⃣ Convert JSON → CSV
    const parser = new Parser({ fields: Object.keys(csvData[0]) });
    const csv = parser.parse(csvData);

    // 5️⃣ Send file for download
    res.header("Content-Type", "text/csv");
    res.attachment("applications_export.csv");
    return res.send(csv);
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ message: "Server error during export" });
  }
};

const applyToJob = async (req, res) => {
  try {
    const studentId = req.user._id;
    const jobId = req.params.jobId;
    const { coverLetter } = req.body || "";

    // 1) Check job exists and open
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== "Open") return res.status(400).json({ message: "Job is not open for applications" });

    // 2) Prevent duplicate apply (fast check)
    const already = await Application.findOne({ studentId, jobId });
    if (already) return res.status(400).json({ message: "You have already applied to this job" });

    // 3) Create application
    const application = await Application.create({ studentId, jobId, coverLetter });

    res.status(201).json(application);
  } catch (err) {
    // handle duplicate key race condition
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }
    console.error("applyToJob error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ studentId: req.user._id })
      .populate({ path: "jobId", select: "title company status" })
      .sort({ appliedAt: -1 });

    res.json(apps);
  } catch (err) {
    console.error("getMyApplications error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// For recruiter/admin: get applicants for a job
const getApplicantsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Authorization: only recruiter who posted or Admin can see
    if (req.user.role === "Recruiter") {
      if (!job.postedBy || job.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Forbidden: you are not the owner of this job" });
      }
    } else if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const applications = await Application.find({ jobId })
      .populate({ path: "studentId", select: "name email resumeUrl" })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("getApplicantsForJob error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getApplications = async (req, res) => {
  try {
    // query params
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "-createdAt";

    // Build filter: recruiters see only applications for their posted jobs
    let filter = {};

    if (req.user.role === "Recruiter") {
      const jobs = await Job.find({ postedBy: req.user._id }).select("_id");
      const jobIds = jobs.map((j) => j._id);
      // If recruiter has no jobs, return empty array
      if (jobIds.length === 0) {
        return res.json({ applications: [], totalApplicants: 0, newToday: 0 });
      }
      filter.jobId = { $in: jobIds };
    } else if (req.user.role === "Student") {
      // optional: students should not call this endpoint; block them
      return res.status(403).json({ message: "Forbidden" });
    }
    // Admin: no filter (see everything)

    // Fetch applications
    const applications = await Application.find(filter)
      .populate("studentId", "name email resumeUrl")
      .populate("jobId", "title company postedBy")
      .sort(sort)
      .limit(limit);

    // Useful metrics for dashboard
    const totalApplicants = await Application.countDocuments(filter);

    // newToday: applications created after start of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const newToday = await Application.countDocuments({
      ...filter,
      createdAt: { $gte: startOfDay },
    });

    res.json({ applications, totalApplicants, newToday });
  } catch (err) {
    console.error("getApplications error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update application status (Recruiter/Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    const allowed = ["Applied", "Shortlisted", "Rejected", "Selected"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const application = await Application.findById(applicationId).populate("jobId");
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Only job owner recruiter or admin can update
    const job = application.jobId;
    if (req.user.role === "Recruiter") {
      if (!job.postedBy || job.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Forbidden: you are not the owner of this job" });
      }
    } else if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (err) {
    console.error("updateApplicationStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: get single application (protected)
const getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("jobId", "title company postedBy")
      .populate("studentId", "name email resumeUrl");
    if (!app) return res.status(404).json({ message: "Application not found" });

    // allow student (owner), recruiter (owner of job) or admin
    if (req.user.role === "Student" && app.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (req.user.role === "Recruiter") {
      if (!app.jobId.postedBy || app.jobId.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }
    // Admin can access

    res.json(app);
  } catch (err) {
    console.error("getApplicationById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// controller/applicationController.js
const getRecruiterSummary = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // 1️⃣ Find jobs posted by this recruiter
    const jobs = await Job.find({ postedBy: recruiterId });
    const jobIds = jobs.map((job) => job._id);

    // 2️⃣ Total applicants
    const totalApplicants = await Application.countDocuments({
      jobId: { $in: jobIds },
    });

    // 3️⃣ New applications today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newApplications = await Application.countDocuments({
      jobId: { $in: jobIds },
      createdAt: { $gte: today },
    });

    // 4️⃣ Active postings
    const activePostings = jobs.filter((j) => j.status === "Open").length;

    res.json({
      activePostings,
      totalApplicants,
      newApplications,
    });
  } catch (err) {
    console.error("Recruiter summary error:", err);
    res.status(500).json({ message: "Failed to load recruiter summary" });
  }
};


module.exports = {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  getApplicationById,
  getApplications,
  getRecruiterSummary,
  exportRecruiterApplications
};
