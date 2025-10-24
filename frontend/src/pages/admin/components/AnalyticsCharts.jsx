import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function AnalyticsCharts() {
  const userData = [
    { month: "Jan", users: 40 },
    { month: "Feb", users: 60 },
    { month: "Mar", users: 90 },
    { month: "Apr", users: 130 },
  ];

  const appData = [
    { month: "Jan", applications: 80 },
    { month: "Feb", applications: 160 },
    { month: "Mar", applications: 250 },
    { month: "Apr", applications: 400 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* User Growth Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-3 text-blue-700">User Growth</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={userData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#2563eb" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Applications Trend Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-3 text-blue-700">
          Applications Trend
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={appData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
