import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import RisksTable from "./RisksTable";
import Heatmap from "./Heatmap";
import StatsCards from "./StatsCards";

function Dashboard() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");
  const [stats, setStats] = useState({
    total_risks: 0,
    high_critical_count: 0,
    average_score: 0,
  });

  const fetchRisks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const url =
        filterLevel === "All"
          ? `${import.meta.env.VITE_API_BACKEND_URL}/risks`
          : `${import.meta.env.VITE_API_BACKEND_URL}/risks?level=${filterLevel}`;

      const response = await axios.get(url);
      setRisks(response.data || []);
    } catch (err) {
      setError("Failed to fetch risks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterLevel]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URL}/stats`);
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
    }
  }, []);

	useEffect(() => {
    fetchRisks();
    fetchStats();
  }, [fetchRisks, fetchStats]);

  const handleDeleteRisk = async (id) => {
    if (window.confirm("Are you sure you want to delete this risk?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BACKEND_URL}/risks/${id}`);
        setRisks(risks.filter((risk) => risk.id !== id));
        fetchStats();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete risk");
      }
    }
  };

  const handleExportCSV = () => {
    if (risks.length === 0) {
      alert("No risks to export");
      return;
    }

    const headers = [
      "ID",
      "Asset",
      "Threat",
      "Likelihood",
      "Impact",
      "Score",
      "Level",
      "Mitigation Hint",
    ];
    const rows = risks.map((risk) => [
      risk.id,
      risk.asset,
      risk.threat,
      risk.likelihood,
      risk.impact,
      risk.score,
      risk.level,
      risk.mitigation_hint,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `risks-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4 items-center flex-wrap">
          <label className="font-semibold text-gray-700">
            Filter by Level:
          </label>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={risks.length === 0}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex gap-2 items-center"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🔥 Risk Heatmap (Likelihood × Impact Matrix)
        </h2>
        <Heatmap risks={risks} />
      </div>

      {/* Risks Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📋 Risk Assessment Details
        </h2>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">⏳ Loading risks...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p>❌ {error}</p>
          </div>
        )}

        {!loading && risks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              ℹ️ No risks assessed yet. Add your first risk by clicking "➕
              Assess Risk" above.
            </p>
          </div>
        )}

        {!loading && risks.length > 0 && (
          <RisksTable risks={risks} onDelete={handleDeleteRisk} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
