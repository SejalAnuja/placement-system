import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Applicants from "./Applicants";
import EditJob from "./EditJob";

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [newApplications, setNewApplications] = useState(0);
  const [editJob, setEditJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recruiter’s jobs
        const jobsRes = await API.get("/jobs/recruiter/me");
        const allJobs = jobsRes.data || [];

        // Limit to 4 jobs for dashboard display
        setJobs(allJobs.slice(0, 4));

        // Fetch total applicants count
        const applicantsRes = await API.get("/applications/recruiter/summary");
        setTotalApplicants(applicantsRes.data.totalApplicants || 0);
        setNewApplications(applicantsRes.data.newApplications || 0);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (selectedJob)
      return (
        <Applicants
          jobId={selectedJob}
          onBack={() => setSelectedJob(null)}
        />
      );
      if (editJob)
          return (
            <EditJob
              job={editJob}
              onBack={() => {
                setEditJob(null);
                window.location.reload(); // reload to see updates
              }}
            />
          );
          const handleDelete = async (jobId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this job?");
  if (!confirmDelete) return;

  try {
    await API.delete(`/jobs/${jobId}`);
    setJobs((prev) => prev.filter((job) => job._id !== jobId));
    alert("Job deleted successfully ✅");
  } catch (err) {
    console.error("Delete job error:", err);
    alert("Failed to delete job ❌");
  }
};

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Recruiter Dashboard</h1>
          <p className="text-gray-600">Welcome back!</p>
        </div>
        <button
          onClick={() => navigate("/recruiter/post-job")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg shadow transition"
        >
          + Post a New Opportunity
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Active Postings</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{jobs.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Applicants</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalApplicants}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">New Applications Today</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{newApplications}</p>
        </div>
      </div>

      {/* My Active Postings */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Active Postings</h2>

        {jobs.length === 0 ? (
          <p className="text-gray-500">You haven’t posted any jobs yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Job Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Company</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date Posted</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-3 text-gray-800 font-medium">{job.title}</td>
                    <td className="px-6 py-3 text-gray-600">{job.company}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          job.status === "Open"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500 text-sm">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 flex justify-center gap-4">
                      <button
                        onClick={() => setSelectedJob(job._id)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        View Applicants
                      </button>
                      <button
                        onClick={() => setEditJob(job)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="text-red-600 hover:underline font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
