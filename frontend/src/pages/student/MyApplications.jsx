import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await API.get("/applications/me");
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="m-8">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>
      {applications.length === 0 ? (
        <p className="text-gray-500">You haven’t applied to any jobs yet.</p>
      ) : (
        <table className="w-full text-left border-collapse bg-white rounded-lg shadow">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 px-4">Job Title</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Applied On</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{app.jobId?.title}</td>
                <td className="py-3 px-4">{app.jobId?.company}</td>
                <td className="py-3 px-4">
                  {new Date(app.appliedAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      app.status === "Applied"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "Shortlisted"
                        ? "bg-green-100 text-green-800"
                        : app.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
