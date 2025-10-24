// src/pages/recruiter/components/JobCard.jsx
import { useNavigate } from "react-router-dom";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <h3 className="text-lg font-bold text-gray-800 mb-1">{job.title}</h3>
      <p className="text-gray-600 mb-3">{job.company}</p>

      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
        <span>📍 {job.location || "Not specified"}</span>
        <span>💰 {job.salary || "Negotiable"}</span>
        <span>🕓 {job.type || "Full-time"}</span>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Applicants: <span className="font-semibold text-gray-700">{job.applicantsCount || 0}</span>
        </p>
        <button
          onClick={() => navigate(`/recruiter/job/${job._id}`)}
          className="text-blue-600 hover:underline font-medium"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}
