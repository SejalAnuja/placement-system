export default function ApplicationStatus({ applications }) {
  const statusCounts = {
    Pending: 0,
    Shortlisted: 0,
    Rejected: 0,
  };

  applications.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">Application Status</h2>
      <div className="flex gap-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="text-center">
            <p className="font-bold text-lg">{count}</p>
            <p className="text-gray-600">{status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
