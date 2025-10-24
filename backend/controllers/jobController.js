// backend/controllers/jobController.js
// backend/controllers/jobController.js
const Job = require("../models/Jobs");
const mongoose = require("mongoose");

// Helper - validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/jobs  (Recruiter or Admin only)
const createJob = async (req, res) => {
  try {
    // Role check: only Recruiter or Admin
    if (!req.user || (req.user.role !== "Recruiter" && req.user.role !== "Admin")) {
      return res.status(403).json({ message: "Forbidden: recruiters only" });
    }

    const { title, description, company, location, stipend, skills, deadline, isRemote } = req.body;

    if (!title || !company) {
      return res.status(400).json({ message: "Title and company are required" });
    }

    // optional: validate deadline (if provided)
    if (deadline && new Date(deadline) <= new Date()) {
      return res.status(400).json({ message: "Deadline must be a future date" });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      stipend,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(",").map(s => s.trim()) : []),
      deadline: deadline ? new Date(deadline) : undefined,
      isRemote: !!isRemote,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("createJob error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/jobs  (public: list jobs with pagination + search + filters)
const getJobs = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const search = req.query.search || "";
    const skill = req.query.skill || "";
    const location = req.query.location || "";
    const isRemote = req.query.isRemote;

    const filter = { status: "Open" };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (skill) filter.skills = { $in: [new RegExp(skill, "i")] };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (typeof isRemote !== "undefined") {
      if (isRemote === "true") filter.isRemote = true;
      else if (isRemote === "false") filter.isRemote = false;
    }

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("postedBy", "name email");

    res.json({ total, page, pages: Math.ceil(total / limit), jobs });
  } catch (err) {
    console.error("getJobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/jobs/:id  (public)
const getJobById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid job id" });

    const job = await Job.findById(id).populate("postedBy", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error("getJobById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/jobs/recruiter (Recruiter: list jobs they posted)
const getRecruiterJobs = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("getRecruiterJobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/jobs/:id  (Recruiter owner or Admin)
const updateJob = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid job id" });

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Only the recruiter who posted the job or Admin can update
    if (req.user.role === "Recruiter" && job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (req.user.role !== "Recruiter" && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // apply updates (only allow certain fields)
    const allowed = ["title", "description", "company", "location", "stipend", "skills", "deadline", "isRemote", "status"];
    allowed.forEach((field) => {
      if (typeof req.body[field] !== "undefined") job[field] = req.body[field];
    });

    // If skills passed as comma string, convert
    if (req.body.skills && typeof req.body.skills === "string") {
      job.skills = req.body.skills.split(",").map(s => s.trim());
    }

    await job.save();
    res.json(job);
  } catch (err) {
    console.error("updateJob error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/jobs/:id  (Recruiter owner or Admin)
const deleteJob = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid job id" });

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user.role === "Recruiter" && job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (req.user.role !== "Recruiter" && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await job.remove();
    res.json({ message: "Job removed" });
  } catch (err) {
    console.error("deleteJob error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  getRecruiterJobs,
  updateJob,
  deleteJob,
};
