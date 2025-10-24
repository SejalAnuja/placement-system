import { useEffect, useState } from "react";
import API from "../../api/axios";
import SummaryCards from "./components/SummaryCards.jsx";
import AnalyticsCharts from "./components/AnalyticsCharts";
import TopRecruiters from "./components/TopRecruiters";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [topRecruiters, setTopRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, recruitersRes] = await Promise.all([
          API.get("/admin/summary"),
          API.get("/admin/top-recruiters"),
        ]);
        setStats(statsRes.data);
        setTopRecruiters(recruitersRes.data);
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-black-700 mb-2">
        Admin Dashboard
      </h1>
      <p className="text-gray-600 mb-6">
        Overview of platform activity and recruiter performance.
      </p>

      {/* Summary Cards */}
      <SummaryCards stats={stats} />

      {/* Charts */}
      <AnalyticsCharts />

      {/* Top Recruiters */}
      <TopRecruiters recruiters={topRecruiters} />
    </div>
  );
}
