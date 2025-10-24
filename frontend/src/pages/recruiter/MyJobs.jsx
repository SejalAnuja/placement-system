import { useEffect, useState } from "react";
import API from "../../api/axios";
import Applicants from "./Applicants";
import EditJob from "./EditJob";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all jobs posted by recruiter
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs/recruiter/me");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  // When viewing applicants
  if (selectedJob)
    return (
      <Applicants
        jobId={selectedJob}
        onBack={() => setSelectedJob(null)}
      />
    );

  // When editing a job
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
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">My Posted Jobs</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500">You haven’t posted any jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job._id}
              className="border rounded-lg p-4 flex justify-between items-center hover:shadow"
            >
              <div>
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      job.status === "Open"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {job.status}
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedJob(job._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  View Applicants
                </button>

                <button
                  onClick={() => setEditJob(job)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
    onClick={() => handleDelete(job._id)}
    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
  >
    Delete
  </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
