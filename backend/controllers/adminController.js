const User = require("../models/User");
const Job = require("../models/Jobs");
const Application = require("../models/Application");
const { Parser } = require("json2csv");

exports.exportUsersCSV = async (req, res) => {
  const users = await User.find().select("name email role createdAt");
  const parser = new Parser();
  const csv = parser.parse(users);
  res.header("Content-Type", "text/csv");
  res.attachment("users.csv");
  res.send(csv);
};

// 📤 Export jobs
exports.exportJobsCSV = async (req, res) => {
  const jobs = await Job.find().populate("recruiter", "name email");
  const data = jobs.map((j) => ({
    title: j.title,
    company: j.company,
    recruiter: j.recruiter?.name || "N/A",
    email: j.recruiter?.email || "N/A",
    status: j.status,
  }));
  const csv = new Parser().parse(data);
  res.header("Content-Type", "text/csv");
  res.attachment("jobs.csv");
  res.send(csv);
};

// 📤 Export applications
exports.exportApplicationsCSV = async (req, res) => {
  const apps = await Application.find()
    .populate("studentId", "name email")
    .populate("jobId", "title company");
  const data = apps.map((a) => ({
    student: a.studentId?.name,
    email: a.studentId?.email,
    jobTitle: a.jobId?.title,
    company: a.jobId?.company,
    status: a.status,
    appliedAt: a.appliedAt,
  }));
  const csv = new Parser().parse(data);
  res.header("Content-Type", "text/csv");
  res.attachment("applications.csv");
  res.send(csv);
};
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Applied", "Shortlisted", "Selected", "Rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.json({ message: "Status updated successfully", application });
  } catch (err) {
    console.error("updateApplicationStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "studentId",
        select: "name email resumeUrl",
      })
      .populate({
        path: "jobId",
        select: "title company",
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("getAllApplications error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getPlatformStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "Student" });
    const totalRecruiters = await User.countDocuments({ role: "Recruiter" });
    const totalAdmins = await User.countDocuments({ role: "Admin" });
    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: "Open" });
    const closedJobs = totalJobs - openJobs;
    const totalApplications = await Application.countDocuments();

    const applicationStatus = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      users: { totalStudents, totalRecruiters, totalAdmins },
      jobs: { totalJobs, openJobs, closedJobs },
      applications: { totalApplications, statusBreakdown: applicationStatus },
    });
  } catch (err) {
    console.error("getPlatformStats error:", err);
    res.status(500).json({ message: "Failed to fetch platform stats" });
  }
};
exports.getAdminSummary = async (req, res) => {
  try {
    const [totalUsers, totalStudents, totalRecruiters, totalJobs, totalApplications] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "Student" }),
        User.countDocuments({ role: "Recruiter" }),
        Job.countDocuments(),
        Application.countDocuments(),
      ]);

    res.json({
      totalUsers,
      totalStudents,
      totalRecruiters,
      totalJobs,
      totalApplications,
    });
  } catch (err) {
    console.error("Admin summary error:", err);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};
exports.getTopRecruiters = async (req, res) => {
  try {
    const recruiters = await User.aggregate([
      { $match: { role: "Recruiter" } },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "postedBy",
          as: "jobs",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          jobCount: { $size: "$jobs" },
        },
      },
      { $sort: { jobCount: -1 } },
      { $limit: 5 },
    ]);
    res.json(recruiters);
  } catch (err) {
    console.error("Top recruiters error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;

    let query = {};
    if (role && role !== "All") query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllJobs = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? { $or: [{ title: new RegExp(search, "i") }, { company: new RegExp(search, "i") }] }
      : {};

    const jobs = await Job.find(query).populate("recruiter", "name email");
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching jobs" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting job" });
  }
};
