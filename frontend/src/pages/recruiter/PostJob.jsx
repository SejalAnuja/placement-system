import { useState } from "react";
import API from "../../api/axios";

export default function PostJob() {
  const [job, setJob] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    stipend: "",
    skills: "",
    deadline: "",
    isRemote: true,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJob((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/jobs", {
        ...job,
        skills: job.skills.split(",").map((s) => s.trim()),
      });
      setMessage("Job posted successfully ✅");
      setJob({
        title: "",
        company: "",
        description: "",
        location: "",
        stipend: "",
        skills: "",
        deadline: "",
        isRemote: true,
      });
    } catch (err) {
      console.error("Error posting job:", err);
      setMessage("Job post failed ❌");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Post a New Job</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="company"
          placeholder="Company Name"
          value={job.company}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={job.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="location"
          placeholder="Location"
          value={job.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="stipend"
          placeholder="Stipend (e.g., 15k/month)"
          value={job.stipend}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="skills"
          placeholder="Skills (comma separated)"
          value={job.skills}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="deadline"
          value={job.deadline}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isRemote"
            checked={job.isRemote}
            onChange={handleChange}
          />
          Remote?
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Job
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
