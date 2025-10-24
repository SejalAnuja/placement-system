import { Users, Briefcase, FileText, GraduationCap } from "lucide-react";

export default function SummaryCards({ stats }) {
  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="h-8 w-8 text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      label: "Students",
      value: stats.totalStudents,
      icon: <GraduationCap className="h-8 w-8 text-green-600" />,
      bg: "bg-green-100",
    },
    {
      label: "Recruiters",
      value: stats.totalRecruiters,
      icon: <Briefcase className="h-8 w-8 text-purple-600" />,
      bg: "bg-purple-100",
    },
    {
      label: "Jobs Posted",
      value: stats.totalJobs,
      icon: <FileText className="h-8 w-8 text-orange-600" />,
      bg: "bg-orange-100",
    },
    {
      label: "Applications",
      value: stats.totalApplications,
      icon: <FileText className="h-8 w-8 text-pink-600" />,
      bg: "bg-pink-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`p-5 rounded-xl shadow-sm flex flex-col items-center justify-center ${card.bg}`}
        >
          {card.icon}
          <p className="text-sm font-medium mt-2 text-gray-700">{card.label}</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {card.value || 0}
          </h2>
        </div>
      ))}
    </div>
  );
}
