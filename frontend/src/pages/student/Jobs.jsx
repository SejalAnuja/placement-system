import { useEffect, useState } from "react";
import API from "../../api/axios";
import JobCard from "./components/JobCard";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   
  
 useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, appRes] = await Promise.all([
          API.get("/jobs"),
          API.get("/applications/me"),
        ]);
        setJobs(jobRes.data.jobs);
        setApplications(appRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load jobs.");
      }
      finally {
        setLoading(false);
      }

    };
    fetchData();
  }, []);
  const appliedJobIds = applications.map((a) => a.jobId?._id);

  const handleApply = async (jobId) => {
    try {
      await API.post(`/api/applications/apply/${jobId}`);
      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, applied: true } : job
        )
      );
    } catch (err) {
      console.error("Apply failed:", err);
      alert("Application failed ❌");
    }
  };

  if (loading) return <p className="text-gray-500">Loading jobs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  
  return (
    <div className="m-8">
      <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs available right now.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job}isApplied={appliedJobIds.includes(job._id)}  onApply={handleApply} />
          ))}
        </div>
      )}
    </div>
  );
}
