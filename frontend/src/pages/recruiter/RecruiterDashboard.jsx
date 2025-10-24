import { useState } from "react";
import PostJob from "./PostJob";
import MyJobs from "./MyJobs";

export default function RecruiterDashboard() {
  const [tab, setTab] = useState("PostJob");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Recruiter Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-6 mb-8 border-b pb-2">
        {["PostJob", "MyJobs"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-medium ${
              tab === t
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {t === "PostJob" ? "Post a Job" : "My Jobs"}
          </button>
        ))}
      </div>

      {/* Render tab content */}
      {tab === "PostJob" ? <PostJob /> : <MyJobs />}
    </div>
  );
}
