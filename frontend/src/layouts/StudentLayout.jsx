import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut, User, Settings } from "lucide-react";

export default function StudentLayout() {
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { path: "/student/dashboard", label: "Dashboard" },
    { path: "/student/jobs", label: "Jobs" },
    { path: "/student/applications", label: "My Applications" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🌟 Top Navbar */}
      <nav className="bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
          {/* Left Section - Logo + App Name */}
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9 text-white drop-shadow-sm"
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
            <h1 className="font-extrabold text-2xl tracking-wide leading-tight">
              Placement & Internship Management<br />
              {/* <span className="text-blue-100 font-semibold">Management System</span> */}
            </h1>
          </div>

          {/* Center Section - Navigation */}
          <div className="flex gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium text-lg transition-all duration-200 ${
                  location.pathname === link.path
                    ? "border-b-2 border-white font-semibold"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section - Profile & Settings */}
          <div className="flex items-center gap-4">
            {/* <button className="text-white/90 hover:text-white">
              <Settings className="h-6 w-6" />
            </button> */}
            <div className="relative group">
              <button className="bg-white/15 rounded-full p-2 hover:bg-white/25 transition">
                <User className="h-6 w-6 text-white" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block">
                <div className="px-4 py-2 text-sm text-gray-700 border-b font-medium">
                  {user.email || "Student"}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-8xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
