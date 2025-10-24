import { useEffect, useState } from "react";
import API from "../../api/axios";
import ResumeManager from "./components/ResumeManager";
import JobCard from "./components/JobCard";
import ApplicationStatus from "./components/ApplicationStatus";
import ApplicationHistory from "./components/ApplicationHistory";
import { Search } from "lucide-react";


export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");

  // 🟢 Fetch jobs + applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, appRes] = await Promise.all([
          API.get("/jobs"),
          API.get("/applications/me"),
        ]);
        setJobs(jobRes.data.jobs || []);
        setApplications(appRes.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchData();
  }, []);

  // 🟢 Get job IDs the student has already applied for
  const appliedJobIds = applications.map((a) => a.jobId?._id);

  // 🟢 Filter jobs based on search
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  // 🟢 Only show jobs that are *not* applied
  const unAppliedJobs = filteredJobs.filter(
    (job) => !appliedJobIds.includes(job._id)
  );

  // 🟢 Limit to 6 visible jobs
  const limitedJobs = unAppliedJobs.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Manage your applications and profile.
      </p>

      {/* Resume Management */}
      <ResumeManager />

      {/* Job Listings */}
<div className="bg-white p-6 rounded-2xl shadow mb-8">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">Job Listings</h2>

    {/* Search Bar with Icon */}
    <div className="relative w-1/3">
      <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
      <input
        type="text"
        placeholder="Search for jobs or companies"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  </div>

  {/* Job Display Conditions */}
  {jobs.length === 0 ? (
    <p className="text-gray-500">No jobs available right now.</p>
  ) : filteredJobs.length === 0 ? (
    <p className="text-gray-500 ">No results found for your search.</p>
  ) : unAppliedJobs.length === 0 ? (
    <p className="text-gray-500">
      You have already applied to all the jobs available right now.
    </p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {limitedJobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          isApplied={appliedJobIds.includes(job._id)}
        />
      ))}
    </div>
  )}
</div>


      {/* Application Overview */}
      <ApplicationStatus applications={applications} />
      <ApplicationHistory applications={applications} />
    </div>
  );
}
