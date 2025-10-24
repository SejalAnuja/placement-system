// backend/seeds/jobsSeeder.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Job = require("../models/Jobs");

dotenv.config();
connectDB();

const jobs = [
  {
    title: "Frontend Intern (React)",
    description: "Work on UI components, state management and API integration.",
    company: "TechCorp Solutions",
  },
  {
    title: "Backend Intern (Node.js)",
    description: "Design REST APIs and work on authentication & DB integration.",
    company: "DataForge Labs",
  },
  {
    title: "Fullstack Intern (MERN)",
    description: "End-to-end feature development across frontend and backend.",
    company: "StartupX",
  },
];

const importData = async () => {
  try {
    await Job.deleteMany(); // comment this if you don't want to delete old docs
    await Job.insertMany(jobs);
    console.log("Sample jobs added.");
    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

importData();
