import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Signup() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [role, setRole] = useState("Student");
const [error, setError] = useState("");

const navigate = useNavigate();

const handleSubmit = async (e) => {
e.preventDefault();
if (password !== confirmPassword) {
setError("Passwords do not match");
return;
}
try {
await API.post("/auth/signup", { name, email, password, role });
navigate("/login");
} catch (err) {
setError(err.response?.data?.message || "Signup failed");
}
};

return ( <div className="flex min-h-screen items-center justify-center bg-gray-100"> <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

    {/* Logo & Title */}
    <div className="text-center mb-8">
      <div className="flex justify-center mb-3">
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

    {/* Form Heading */}
    <h2 className="text-2xl font-bold mb-2">Create Account</h2>
    <p className="text-gray-500 mb-6">Start your journey with us.</p>

    {/* Error */}
    {error && <p className="text-red-500 mb-4">{error}</p>}

    {/* Form */}
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-3 rounded-lg"
        required
      />
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-3 rounded-lg"
        required
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-3 rounded-lg"
        required
      />
      <input
        type="password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border p-3 rounded-lg"
        required
      />

      {/* Role Selection */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-3 rounded-lg"
      >
        <option value="Student">Student</option>
        <option value="Recruiter">Recruiter</option>
        <option value="Admin">Admin</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
      >
        Sign Up
      </button>
    </form>

    {/* Login Link */}
    <p className="text-center text-sm mt-4 text-gray-600">
      Already have an account?{" "}
      <Link to="/login" className="text-blue-600 hover:underline">
        Login
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
