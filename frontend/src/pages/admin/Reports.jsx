import API from "../../api/axios";
import { FileDown } from "lucide-react";

export default function Reports() {
  const exportData = async (type) => {
    try {
      const res = await API.get(`/admin/export/${type}`, {
        responseType: "blob", // important for files
      });

      // Create a blob URL and download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed ❌");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Export Platform Data</h2>
      <p className="text-gray-600 mb-6">
        Download platform-wide data in CSV format for offline analysis.
      </p>

      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { label: "Export Users", type: "users" },
          { label: "Export Jobs", type: "jobs" },
          { label: "Export Applications", type: "applications" },
        ].map((item) => (
          <button
            key={item.type}
            onClick={() => exportData(item.type)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
          >
            <FileDown className="h-5 w-5" /> {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
