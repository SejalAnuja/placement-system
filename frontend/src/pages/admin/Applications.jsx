import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Search } from "lucide-react";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // 🟢 Fetch all applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/admin/applications");
        setApplications(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // 🔍 Handle filtering and searching
  useEffect(() => {
    let filteredData = applications;

    if (statusFilter !== "All") {
      filteredData = filteredData.filter((a) => a.status === statusFilter);
    }

    if (search.trim()) {
      filteredData = filteredData.filter(
        (a) =>
          a.studentId?.name?.toLowerCase().includes(search.toLowerCase()) ||
          a.jobId?.title?.toLowerCase().includes(search.toLowerCase()) ||
          a.jobId?.company?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(filteredData);
  }, [statusFilter, search, applications]);

  // 🟢 Handle status update
  const handleStatusChange = async (appId, newStatus) => {
    try {
      await API.patch(`/admin/applications/${appId}/status`, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app
        )
      );
      setMessage("Status updated ✅");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Failed to update status:", err);
      setMessage("Failed to update ❌");
    }
  };

  // 🎨 Status badge styles
  const getStatusBadge = (status) => {
    const styles = {
      Applied: "bg-gray-200 text-gray-700",
      Shortlisted: "bg-yellow-100 text-yellow-700",
      Selected: "bg-green-100 text-green-700",
      Rejected: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          styles[status] || "bg-gray-200 text-gray-600"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) return <p className="text-gray-600">Loading applications...</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Applications</h2>

        {message && (
          <p className="text-green-600 font-medium">{message}</p>
        )}

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users or jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border pl-8 pr-2 py-1 rounded-lg"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-2 py-1"
          >
            <option value="All">All</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center mt-6">
          No applications found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50 text-gray-700 text-left">
                <th className="p-2 border">Student</th>
                <th className="p-2 border">Job Title</th>
                <th className="p-2 border">Company</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
                <th className="p-2 border">Resume</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a._id} className="hover:bg-gray-50 text-gray-700">
                  <td className="p-2 border">{a.studentId?.name || "N/A"}</td>
                  <td className="p-2 border">{a.jobId?.title || "N/A"}</td>
                  <td className="p-2 border">{a.jobId?.company || "N/A"}</td>
                  <td className="p-2 border">{getStatusBadge(a.status)}</td>
                  <td className="p-2 border">
                    <select
                      value={a.status}
                      onChange={(e) =>
                        handleStatusChange(a._id, e.target.value)
                      }
                      className="border p-2 rounded bg-gray-50"
                    >
                      <option>Applied</option>
                      <option>Shortlisted</option>
                      <option>Selected</option>
                      <option>Rejected</option>
                    </select>
                  </td>
                  <td className="p-2 border text-center">
                    {a.studentId?.resumeUrl ? (
                      <a
                        href={`http://localhost:5000${
                          a.studentId.resumeUrl.startsWith("/")
                            ? a.studentId.resumeUrl
                            : "/" + a.studentId.resumeUrl
                        }`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
