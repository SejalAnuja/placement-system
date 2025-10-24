import { useEffect, useState } from "react";
import API from "../../../api/axios";

export default function ResumeManager() {
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [message, setMessage] = useState("");

  // 🟢 Fetch user's uploaded resume (if any)
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await API.get("/resume/me");
        if (res.data?.resumeUrl) {
          const fullUrl = formatResumeUrl(res.data.resumeUrl);
          setResumeUrl(fullUrl);
          localStorage.setItem("resumeUrl", fullUrl);
        } else {
          // fallback: check localStorage
          const storedUrl = localStorage.getItem("resumeUrl");
          if (storedUrl) setResumeUrl(storedUrl);
        }
      } catch (err) {
        console.error("Resume fetch failed:", err);
        const storedUrl = localStorage.getItem("resumeUrl");
        if (storedUrl) setResumeUrl(storedUrl);
      }
    };
    fetchResume();
  }, []);

  // 🟢 Helper — ensures resume URL is valid for browser access
  const formatResumeUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    // convert local server path to absolute accessible URL
    return `http://localhost:5000/${url.replace(/\\/g, "/")}`;
  };

  // 🟢 Handle Resume Upload
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resume) return setMessage("Please select a resume first!");

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      const res = await API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = formatResumeUrl(res.data?.resumeUrl);
      setResumeUrl(uploadedUrl);
      localStorage.setItem("resumeUrl", uploadedUrl);
      setMessage("Resume uploaded successfully ✅");
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("Resume upload failed ❌");
    }
  };

  // 🟢 Handle Re-upload action
  const handleReupload = () => {
    setResumeUrl("");
    setMessage("");
    localStorage.removeItem("resumeUrl");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-8">
      <h2 className="text-xl font-semibold mb-2">Resume Management</h2>
      <p className="text-gray-600 mb-3">
        Upload your resume in PDF format to apply for jobs.
      </p>

      {resumeUrl ? (
        // ✅ Resume already uploaded
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline font-medium"
          >
            📄 View Uploaded Resume
          </a>
          <button
            onClick={handleReupload}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Re-upload
          </button>
          {message && <p className="text-green-600 text-sm">{message}</p>}
        </div>
      ) : (
        // 🟢 Upload form
        <form
          onSubmit={handleResumeUpload}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResume(e.target.files[0])}
            className="border p-2 rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Upload Resume
          </button>
          {message && <p className="text-green-600 text-sm">{message}</p>}
        </form>
      )}
    </div>
  );
}
