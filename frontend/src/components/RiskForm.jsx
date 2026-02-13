import React, { useState } from "react";
import axios from "axios";

function RiskForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    asset: "",
    threat: "",
    likelihood: 3,
    impact: 3,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Calculate risk score and level
  const score = formData.likelihood * formData.impact;
  const getLevel = (score) => {
    if (score >= 1 && score <= 5) return "Low";
    if (score >= 6 && score <= 12) return "Medium";
    if (score >= 13 && score <= 18) return "High";
    if (score >= 19 && score <= 25) return "Critical";
    return "Unknown";
  };
  const level = getLevel(score);

  const getLevelColor = (level) => {
    switch (level) {
      case "Low":
        return "#00FF00";
      case "Medium":
        return "#FFFF00";
      case "High":
        return "#FFA500";
      case "Critical":
        return "#FF0000";
      default:
        return "#999999";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "asset" || name === "threat" ? value : parseInt(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URL}/assess-risk`, {
        asset: formData.asset,
        threat: formData.threat,
        likelihood: formData.likelihood,
        impact: formData.impact,
      });

      setSuccessMessage(
        `✅ Risk added successfully! (Score: ${response.data.score}, Level: ${response.data.level})`,
      );
      setFormData({
        asset: "",
        threat: "",
        likelihood: 3,
        impact: 3,
      });

      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to add risk. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Assess New Risk</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Asset Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Asset Name *
          </label>
          <input
            type="text"
            name="asset"
            value={formData.asset}
            onChange={handleChange}
            placeholder="e.g., Customer Database, Web Server, Email Server"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            The organizational asset or system at risk
          </p>
        </div>

        {/* Threat */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Threat *
          </label>
          <input
            type="text"
            name="threat"
            value={formData.threat}
            onChange={handleChange}
            placeholder="e.g., Data Breach, Ransomware Attack, Unauthorized Access"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            The potential risk or threat to the asset
          </p>
        </div>

        {/* Likelihood */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Likelihood: {formData.likelihood} / 5
          </label>
          <input
            type="range"
            name="likelihood"
            min="1"
            max="5"
            value={formData.likelihood}
            onChange={handleChange}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Very Unlikely (1)</span>
            <span>Very Likely (5)</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            How probable is this risk event to occur?
          </p>
        </div>

        {/* Impact */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Impact: {formData.impact} / 5
          </label>
          <input
            type="range"
            name="impact"
            min="1"
            max="5"
            value={formData.impact}
            onChange={handleChange}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Minimal (1)</span>
            <span>Catastrophic (5)</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            How severe would the impact be if this risk occurred?
          </p>
        </div>

        {/* Preview */}
        <div
          className="p-6 rounded-lg border-2 border-indigo-300 bg-indigo-50"
          style={{ borderColor: getLevelColor(level), borderWidth: "3px" }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            📈 Real-Time Preview
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Risk Score:</p>
              <p className="text-2xl font-bold text-gray-800">{score}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Risk Level:</p>
              <p
                className="text-2xl font-bold"
                style={{ color: getLevelColor(level) }}
              >
                {level}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-indigo-200">
            <p className="text-sm text-gray-600">Score Calculation:</p>
            <p className="font-mono text-gray-800">
              {formData.likelihood} × {formData.impact} = {score}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Score 1-5: Low | 6-12: Medium | 13-18: High | 19-25: Critical
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.asset || !formData.threat}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "⏳ Submitting..." : "✅ Submit Risk Assessment"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">❌ Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p>{successMessage}</p>
            <p className="text-xs mt-1">Redirecting to dashboard...</p>
          </div>
        )}
      </form>

      {/* GRC Context */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">📋 GRC Context</h4>
        <p className="text-sm text-blue-800">
          This assessment aligns with <strong>NIST SP 800-30</strong> Risk
          Assessment Framework. Likelihood (probability) and Impact (severity)
          are multiplied to create a Risk Score, which determines priority for
          mitigation planning.
        </p>
      </div>
    </div>
  );
}

export default RiskForm;
