export default function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-semibold text-blue-600 mt-2">{value}</p>
    </div>
  );
}
