import React, { useState } from "react";

function SortIcon({ column, sortKey, direction }) {
  if (sortKey !== column) return <span> ↕️</span>;
  return <span>{direction === "ascending" ? " ↑" : " ↓"}</span>;
}

function RisksTable({ risks, onDelete }) {
  const [sortConfig, setSortConfig] = useState({
    key: "score",
    direction: "descending",
  });

  const getLevelColor = (level) => {
    switch (level) {
      case "Low":
        return "#d4edda";
      case "Medium":
        return "#fff3cd";
      case "High":
        return "#ffe5cc";
      case "Critical":
        return "#f8d7da";
      default:
        return "#e2e3e5";
    }
  };

  const getLevelBadgeColor = (level) => {
    switch (level) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sortedRisks = [...risks].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string") {
      return sortConfig.direction === "ascending"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortConfig.direction === "ascending"
      ? aValue - bValue
      : bValue - aValue;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-indigo-100 border-b-2 border-indigo-300">
            <th
              onClick={() => handleSort("id")}
              className="px-4 py-3 cursor-pointer"
            >
              ID{" "}
              <SortIcon
                column="id"
                sortKey={sortConfig.key}
                direction={sortConfig.direction}
              />
            </th>

            <th
              onClick={() => handleSort("asset")}
              className="px-4 py-3 cursor-pointer"
            >
              Asset{" "}
              <SortIcon
                column="asset"
                sortKey={sortConfig.key}
                direction={sortConfig.direction}
              />
            </th>

            <th
              onClick={() => handleSort("threat")}
              className="px-4 py-3 cursor-pointer"
            >
              Threat{" "}
              <SortIcon
                column="threat"
                sortKey={sortConfig.key}
                direction={sortConfig.direction}
              />
            </th>

            <th
              onClick={() => handleSort("likelihood")}
              className="px-4 py-3 text-center cursor-pointer"
            >
              L{" "}
              <SortIcon
                column="likelihood"
                sortKey={sortConfig.key}
                direction={sortConfig.direction}
              />
            </th>

            <th
              onClick={() => handleSort("impact")}
              className="px-4 py-3 text-center cursor-pointer"
            >
              I{" "}
              <SortIcon
                column="impact"
                sortKey={sortConfig.key}
                direction={sortConfig.direction}
              />
            </th>

            <th
              onClick={() => handleSort("score")}
              className="px-4 py-3 text-center cursor-pointer"
            >
              Score{" "}
              <SortIcon
                column="score"
                sortKey={sortConfig.key}
                direction={sortConfig.direction}
              />
            </th>

            <th
              onClick={() => handleSort("level")}
              className="px-4 py-3 text-center cursor-pointer"
            >
              Level{" "}
              <SortIcon
                column="level"
                sortKey={sortConfig.key}
                direction={sortConfig.direction}
              />
            </th>

            <th className="px-4 py-3">Mitigation Hint</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {sortedRisks.map((risk) => (
            <tr
              key={risk.id}
              className="border-b hover:bg-gray-50 transition"
              style={{ backgroundColor: getLevelColor(risk.level) }}
            >
              <td className="px-4 py-3 font-semibold">{risk.id}</td>
              <td className="px-4 py-3">{risk.asset}</td>
              <td className="px-4 py-3">{risk.threat}</td>

              <td className="px-4 py-3 text-center font-bold text-blue-600">
                {risk.likelihood}
              </td>

              <td className="px-4 py-3 text-center font-bold text-red-600">
                {risk.impact}
              </td>

              <td className="px-4 py-3 text-center font-bold">{risk.score}</td>

              <td className="px-4 py-3 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelBadgeColor(risk.level)}`}
                >
                  {risk.level}
                </span>
              </td>

              <td className="px-4 py-3 text-xs">
                {risk.mitigation_hint || "—"}
              </td>

              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onDelete(risk.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RisksTable;
