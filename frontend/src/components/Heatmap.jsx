import React, { useState } from "react";

function Heatmap({ risks }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  const getLevelColor = (score) => {
    if (score >= 1 && score <= 5) return "#d4edda";
    if (score >= 6 && score <= 12) return "#fff3cd";
    if (score >= 13 && score <= 18) return "#ffe5cc";
    if (score >= 19 && score <= 25) return "#f8d7da";
    return "#f5f5f5";
  };

  const getLevelText = (score) => {
    if (score >= 1 && score <= 5) return "Low";
    if (score >= 6 && score <= 12) return "Medium";
    if (score >= 13 && score <= 18) return "High";
    if (score >= 19 && score <= 25) return "Critical";
    return "";
  };

  // Build heatmap data
  const heatmapData = {};
  risks.forEach((risk) => {
    const key = `${risk.likelihood}-${risk.impact}`;
    if (!heatmapData[key]) {
      heatmapData[key] = {
        count: 0,
        assets: [],
        level: risk.level,
      };
    }
    heatmapData[key].count += 1;
    heatmapData[key].assets.push(risk.asset);
  });

  return (
    <div className="space-y-6">
      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Column Headers (Impact) */}
          <div className="flex gap-0">
            <div className="w-24"></div>
            {[1, 2, 3, 4, 5].map((impact) => (
              <div
                key={`header-${impact}`}
                className="w-24 text-center font-bold text-gray-700 py-2 border border-gray-300"
              >
                Impact {impact}
              </div>
            ))}
          </div>

          {/* Grid Rows */}
          {[1, 2, 3, 4, 5].map((likelihood) => (
            <div key={`row-${likelihood}`} className="flex gap-0">
              <div className="w-24 font-bold text-gray-700 py-4 border border-gray-300 flex items-center justify-center bg-gray-50">
                L {likelihood}
              </div>

              {[1, 2, 3, 4, 5].map((impact) => {
                const score = likelihood * impact;
                const key = `${likelihood}-${impact}`;
                const cellData = heatmapData[key];
                const isHovered = hoveredCell === key;

                return (
                  <div
                    key={key}
                    onMouseEnter={() => setHoveredCell(key)}
                    onMouseLeave={() => setHoveredCell(null)}
                    className="w-24 h-24 border border-gray-300 flex flex-col items-center justify-center cursor-pointer transition hover:shadow-lg hover:scale-105 relative"
                    style={{
                      backgroundColor: cellData
                        ? getLevelColor(score)
                        : getLevelColor(score),
                    }}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">
                        {cellData?.count || 0}
                      </div>
                      <div className="text-xs text-gray-600">
                        {getLevelText(score)}
                      </div>
                    </div>

                    {/* Tooltip */}
                    {isHovered && cellData && cellData.count > 0 && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs z-50 whitespace-nowrap border border-gray-600 shadow-lg">
                        <div className="font-semibold mb-1">
                          {cellData.count} risk(s) here:
                        </div>
                        <div className="max-h-24 overflow-y-auto">
                          {cellData.assets.map((asset, idx) => (
                            <div key={idx} className="text-xs">
                              • {asset}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-3">📊 Heatmap Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 border border-gray-300"
              style={{ backgroundColor: "#d4edda" }}
            ></div>
            <span className="text-sm text-gray-700">Low (1-5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 border border-gray-300"
              style={{ backgroundColor: "#fff3cd" }}
            ></div>
            <span className="text-sm text-gray-700">Medium (6-12)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 border border-gray-300"
              style={{ backgroundColor: "#ffe5cc" }}
            ></div>
            <span className="text-sm text-gray-700">High (13-18)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 border border-gray-300"
              style={{ backgroundColor: "#f8d7da" }}
            ></div>
            <span className="text-sm text-gray-700">Critical (19-25)</span>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ How to read:</strong> The heatmap shows the count of risks
          for each likelihood-impact combination. Cells with higher scores
          (bottom-right) represent higher-risk combinations. Hover over any cell
          to see asset details.
        </p>
      </div>
    </div>
  );
}

export default Heatmap;
