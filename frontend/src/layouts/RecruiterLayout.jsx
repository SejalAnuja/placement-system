import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, Settings } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
//import API from "../../api/axios";
import API from "../api/axios";

export default function RecruiterLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { path: "/recruiter/dashboard", label: "Dashboard" },
    { path: "/recruiter/post-job", label: "Post a Job" },
    { path: "/recruiter/my-jobs", label: "My Jobs" },
  ];
  

const handleExport = async () => {
  try {
    const res = await API.get("/applications/recruiter/export", {
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "applications_export.csv";
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export failed:", err);
    alert("Failed to export data ❌");
  }
};


  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🔷 Blue Gradient Navbar */}
      <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0112 21a12.083 12.083 0 01-6.16-10.422L12 14z"
              />
            </svg>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Placement & Internship Management
            </h1>
          </div>

          {/* Center Section */}
          <div className="flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium transition ${
                  location.pathname === link.path
                    ? "border-b-2 border-white text-white"
                    : "text-gray-100 hover:text-white/90"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
               onClick={handleExport}
                className="text-base font-medium transition border-white text-white hover:text-white/90"
            >
                Export Data
            </button>
          </div>
          


          {/* Right Section */}
          <div className="flex items-center gap-5">
            <button className="hover:text-gray-200 transition">
              <Settings className="h-5 w-5" />
            </button>

            <div className="relative group">
              <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition">
                <User className="h-5 w-5 text-white" />
              </button>

              <div className="absolute right-0 mt-2 w-44 bg-white text-gray-700 rounded-lg shadow-lg hidden group-hover:block">
                <div className="px-4 py-2 border-b text-sm">
                  {user?.email || "Recruiter"}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
