import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut, UserCog, BarChart3 } from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/users", label: "Users" },
    { path: "/admin/jobs", label: "Jobs" },
    { path: "/admin/applications", label: "Applications" },
    { path: "/admin/reports", label: "Reports" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold tracking-wide">PIMS Admin Panel</h1>
          </div>

          <div className="flex gap-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition ${
                  location.pathname === link.path
                    ? "border-b-2 border-white"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <UserCog className="h-5 w-5" />
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded-md font-semibold hover:bg-gray-100"
            >
              <LogOut className="inline h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
