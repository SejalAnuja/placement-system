import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MyApplications from "./pages/student/MyApplications";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import Jobs from "./pages/student/Jobs";
import RecruiterLayout from "./layouts/RecruiterLayout";
import PostJob from "./pages/recruiter/PostJob";
import MyJobs from "./pages/recruiter/MyJobs";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Job from "./pages/admin/Jobs";
import Applications from "./pages/admin/Applications";
import Reports from "./pages/admin/Reports"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/student"
        element={
          <ProtectedRoute role="Student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="jobs" element={<Jobs/>} /> 
      </Route>
    <Route
            path="/recruiter"
            element={
              <ProtectedRoute role="Recruiter">
                <RecruiterLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RecruiterDashboard />} />
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="my-jobs" element={<MyJobs />} />
            {/* <Route path="export" element={<ExportData />} /> */}
          </Route>
          {/* ✅ Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="Admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="jobs" element={<Job />} />
        <Route path="applications" element={<Applications />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;
