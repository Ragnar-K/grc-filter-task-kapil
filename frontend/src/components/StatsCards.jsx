import React from "react";

function StatCard({ title, value, icon, color }) {
  return (
    <div
      className="rounded-lg shadow-lg p-6 text-white"
      style={{ backgroundColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl opacity-30">{icon}</div>
      </div>
    </div>
  );
}

function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Total Risks Assessed"
        value={stats.total_risks || 0}
        icon="📊"
        color="#3b82f6"
      />

      <StatCard
        title="High + Critical Risks"
        value={stats.high_critical_count || 0}
        icon="⚠️"
        color={stats.high_critical_count > 0 ? "#dc2626" : "#7c3aed"}
      />

      <StatCard
        title="Average Risk Score"
        value={(stats.average_score || 0).toFixed(1)}
        icon="📈"
        color="#8b5cf6"
      />

      <StatCard
        title="Highest Score"
        value={stats.max_score || 0}
        icon="🔥"
        color="#f97316"
      />
    </div>
  );
}

export default StatsCards;
