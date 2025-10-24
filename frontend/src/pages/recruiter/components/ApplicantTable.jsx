export default function ApplicantTable({ applicants }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Applicants</h2>

      <table className="w-full">
        <thead className="text-gray-500 text-sm border-b">
          <tr>
            <th className="text-left py-3">Student Name</th>
            <th>University/Major</th>
            <th>Application Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((a) => (
            <tr key={a._id} className="border-b text-center">
              <td className="text-left py-3">{a.studentName}</td>
              <td>{a.university || "—"}</td>
              <td>{new Date(a.createdAt).toLocaleDateString()}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    a.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : a.status === "Shortlisted"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {a.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
