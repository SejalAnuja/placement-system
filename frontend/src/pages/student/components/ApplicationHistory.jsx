export default function ApplicationHistory({ applications }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Application History</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-gray-600">
            <th className="py-2">Company</th>
            <th className="py-2">Job Title</th>
            <th className="py-2">Date Applied</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id} className="border-b hover:bg-gray-50">
              <td className="py-2">{app.jobId?.company}</td>
              <td className="py-2">{app.jobId?.title}</td>
              <td className="py-2">
                {new Date(app.appliedAt).toLocaleDateString()}
              </td>
              <td className="py-2">
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
    </div>
  );
}
