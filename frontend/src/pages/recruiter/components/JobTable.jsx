export default function JobTable({ jobs }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Active Postings</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Post a New Opportunity</button>
      </div>

      <table className="w-full border-t">
        <thead className="text-gray-500 text-sm">
          <tr>
            <th className="text-left py-3">Job Title</th>
            <th>Applicants</th>
            <th>Date Posted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id} className="border-t">
              <td className="py-3 font-medium">{job.title}</td>
              <td className="text-center">{job.applicantCount || 0}</td>
              <td className="text-center">{new Date(job.createdAt).toLocaleDateString()}</td>
              <td className="text-center text-blue-600 flex justify-center gap-3">
                <button>View Applicants</button>
                <button className="text-gray-500">Edit</button>
                <button className="text-red-500">Archive</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
