const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://placement-system-frontend.onrender.com", // ✅ Your frontend URL
    credentials: true,               // ✅ Allow cookies / tokens
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);                // Allow cross-origin requests (React ↔ Node)
app.use(express.json());        // Parse incoming JSON requests

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/job"));
app.use("/api/resume", require("./routes/resume"));
app.use("/api/applications", require("./routes/application"));


// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/jobs", require("./routes/job"));
// app.use("/api/applications", require("./routes/application"));

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
