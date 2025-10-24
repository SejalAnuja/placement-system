export default function TopRecruiters({ recruiters }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-semibold text-black mb-4">
        🏆 Top Recruiters by Job Postings
      </h3>

      {recruiters.length === 0 ? (
        <p className="text-gray-500">No recruiters found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-blue-50 text-left text-gray-700">
              <tr>
                <th className="p-2 border">Recruiter Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Jobs Posted</th>
              </tr>
            </thead>
            <tbody>
              {recruiters.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 text-gray-700">
                  <td className="p-2 border">{r.name}</td>
                  <td className="p-2 border">{r.email}</td>
                  <td className="p-2 border font-semibold">
                    {r.jobCount}
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
