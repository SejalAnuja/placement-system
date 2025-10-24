import API from "../../../api/axios";
import { useState } from "react";

export default function JobCard({ job, isApplied }) {
  const [applied, setApplied] = useState(isApplied);

  const handleApply = async () => {
    try {
      await API.post(`/applications/apply/${job._id}`);
      setApplied(true);
    } catch (err) {
      console.error("Apply failed:", err);
    }
  };

  return (
    <div className="border rounded-lg p-5 shadow-sm hover:shadow-lg transition-all bg-white">
      <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
      <p className="text-gray-600 mb-2">{job.company}</p>
      <p className="text-sm text-gray-500 mb-4">{job.location || "Remote"}</p>
      <button
        onClick={handleApply}
        disabled={applied}
        className={`w-full py-2 rounded-lg font-medium ${
          applied
            ? "bg-gray-300 cursor-not-allowed text-gray-700"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {applied ? "Applied" : "Apply Now"}
      </button>
    </div>
  );
}
