import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [role, setRole] = useState("Student");
const [error, setError] = useState("");

const { login } = useContext(AuthContext);
const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/auth/login", { email, password, role });
    const { token, role: userRole } = res.data; // ✅ rename here
    login(token, userRole);

    if (userRole === "Student") navigate("/student/dashboard");
    else if (userRole === "Recruiter") navigate("/recruiter/dashboard");
    else navigate("/admin/dashboard");
  } catch (err) {
    console.error("Login Error:", err.response?.data || err.message);
    setError(err.response?.data?.message || "Login failed");
  }
};

return ( <div className="flex min-h-screen items-center justify-center bg-gray-100"> <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">


    {/* Title */}
    <div className="text-center mb-8">
      <div className="flex justify-center mb-3">
        {/* Logo Icon (graduation cap style like in your image) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-blue-600"
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
      </div>
      <h1 className="text-xl font-bold">Placement & Internship</h1>
      <p className="text-lg font-semibold">Management System</p>
    </div>

    {/* Login Box */}
    <h2 className="text-2xl font-bold mb-2">Login</h2>
    <p className="text-gray-500 mb-6">
      Select your role and login to your account.
    </p>

    {/* Role Tabs */}
    <div className="flex gap-6 mb-6 border-b pb-2">
      {["Student", "Recruiter", "Admin"].map((r) => (
        <button
          key={r}
          onClick={() => setRole(r)}
          className={`text-sm font-medium ${
            role === r
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          {r}
        </button>
      ))}
    </div>

    {/* Error Message */}
    {error && <p className="text-red-500 mb-4">{error}</p>}

    {/* Form */}
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {/* Email */}
      <div className="relative">
        <span className="absolute left-3 top-3 text-gray-400">
          📧
        </span>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Password */}
      <div className="relative">
        <span className="absolute left-3 top-3 text-gray-400">
          🔒
        </span>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <Link
          to="/forgot-password"
          className="absolute right-3 top-3 text-sm text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>

    {/* Sign Up */}
    <p className="text-center text-sm mt-4 text-gray-600">
      Don’t have an account?{" "}
      <Link to="/signup" className="text-blue-600 hover:underline">
        Sign Up
      </Link>
    </p>

    {/* Footer */}
    <div className="flex justify-center gap-4 text-sm text-gray-500 mt-6">
      <Link to="/terms" className="hover:underline">Terms of Service</Link>
      <span>•</span>
      <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
    </div>
  </div>
</div>


);
}
