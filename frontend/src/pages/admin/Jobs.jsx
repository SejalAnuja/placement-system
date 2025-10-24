import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Search, Trash2 } from "lucide-react";

export default function Job() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get(`/admin/jobs?search=${search}`);
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [search]);

  // Delete a job
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await API.delete(`/admin/jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete job ❌");
    }
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="bg-white p-8 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold ">Manage Job Postings</h2>
      <div className="flex gap-2">
        <div className="relative">
             <Search className="absolute left-2 top-2.5 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search jobs or companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border pl-8 pr-2 py-1 rounded-lg"
        />
        </div>
      </div>
    </div>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No job postings found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50 text-left text-gray-700">
              <th className="border p-2">Title</th>
              <th className="border p-2">Company</th>
              {/* <th className="border p-2">Recruiter</th> */}
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50">
                <td className="border p-2">{job.title}</td>
                <td className="border p-2">{job.company}</td>
                {/* <td className="border p-2">{job.recruiter?.name || "N/A"}</td> */}
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      job.status === "Open"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="border p-2 text-right">
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="inline h-5 w-5"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
