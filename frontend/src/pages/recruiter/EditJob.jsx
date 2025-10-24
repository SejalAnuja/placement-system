import { useState } from "react";
import API from "../../api/axios";

export default function EditJob({ job, onBack }) {
  const [form, setForm] = useState({
    title: job.title || "",
    company: job.company || "",
    description: job.description || "",
    location: job.location || "",
    salary: job.salary || "",
    status: job.status || "Open",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.patch(`/jobs/${job._id}`, form);
      setMessage("✅ Job updated successfully!");
    } catch (err) {
      console.error("Job update error:", err);
      setMessage("❌ Failed to update job.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="text-blue-600 mb-4 hover:underline"
      >
        ← Back to My Jobs
      </button>

      <h2 className="text-2xl font-bold mb-4">Edit Job</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="border p-3 rounded-lg"
          required
        />

        <input
          type="text"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company"
          className="border p-3 rounded-lg"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-3 rounded-lg"
          rows={4}
        />

        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          name="salary"
          value={form.salary}
          onChange={handleChange}
          placeholder="Salary (e.g. ₹30,000/month)"
          className="border p-3 rounded-lg"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Update Job
        </button>

        {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
}
