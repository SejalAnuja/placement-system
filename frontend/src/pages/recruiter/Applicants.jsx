import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Applicants({ jobId, onBack }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await API.get(`/applications/job/${jobId}`);
        setApplicants(res.data);
      } catch (err) {
        console.error("Error fetching applicants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await API.put(`/applications/${appId}/status`, { status: newStatus });
      setMessage(`Status updated to ${newStatus} ✅`);

      // update state locally
      setApplicants((prev) =>
        prev.map((a) =>
          a._id === appId ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      setMessage("Failed to update status ❌");
      console.error("Update error:", err);
    }
  };

  if (loading) return <p>Loading applicants...</p>;

  return (
    <div className="bg-white shadow p-6 rounded-xl">
      <button
        onClick={onBack}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Jobs
      </button>

      <h2 className="text-2xl font-bold mb-4">Applicants</h2>
      {message && <p className="text-green-600 mb-2">{message}</p>}

      {applicants.length === 0 ? (
        <p className="text-gray-500">No applicants yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Resume</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a) => (
              <tr key={a._id}>
                <td className="border p-2">{a.studentId?.name}</td>
                <td className="border p-2">{a.studentId?.email}</td>
                <td className="border p-2">
                  {a.studentId?.resumeUrl ? (
                    <a
                     href={`srv-d3tftm75r7bs73epgci0${
                          a.studentId.resumeUrl.startsWith("/")
                            ? a.studentId.resumeUrl
                            : "/" + a.studentId.resumeUrl
                        }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  ) : (
                    "No resume"
                  )}
                </td>
                <td className="border p-2">{a.status}</td>
                <td className="border p-2">
                  <select
                    value={a.status}
                    onChange={(e) =>
                      handleStatusChange(a._id, e.target.value)
                    }
                    className="border p-1 rounded"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Selected">Selected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
