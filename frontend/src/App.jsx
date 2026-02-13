import React, { useState } from "react";
import RiskForm from "./components/RiskForm";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            GRC Risk Assessment Dashboard
          </h1>
          <p className="text-gray-600">
            Governance, Risk, and Compliance - Risk Likelihood × Impact Matrix
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-indigo-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex gap-4">
          <button
            onClick={() => setCurrentPage("dashboard")}
            className={`px-6 py-2 rounded font-semibold transition ${
              currentPage === "dashboard"
                ? "bg-indigo-600"
                : "bg-indigo-700 hover:bg-indigo-600"
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setCurrentPage("assess")}
            className={`px-6 py-2 rounded font-semibold transition ${
              currentPage === "assess"
                ? "bg-indigo-600"
                : "bg-indigo-700 hover:bg-indigo-600"
            }`}
          >
            ➕ Assess Risk
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "assess" && (
          <RiskForm onSuccess={() => setCurrentPage("dashboard")} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>
            GRC Risk Assessment Tool • Aligns with NIST SP 800-30 Risk
            Assessment Framework
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
