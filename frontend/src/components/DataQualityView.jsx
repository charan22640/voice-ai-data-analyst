import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Supports two shapes:
// A) From /api/data/quality: { completeness: { col: { score, missing_count } }, data_types: {...} }
// B) From upload info: { data_quality: { completeness_score, ... }, data_types or column_types }
const DataQualityView = ({ dataInfo }) => {
  if (!dataInfo) return null;

  const totalRows = dataInfo.total_rows || dataInfo.rows || 0;
  const dq = dataInfo.data_quality || {};

  // Normalize completeness to { col: { completePct, missingPct } }
  const normalizedCompleteness = {};
  if (dq.completeness && typeof dq.completeness === 'object') {
    Object.entries(dq.completeness).forEach(([col, stats]) => {
      const score = typeof stats.score === 'number' ? stats.score : undefined;
      const missingCount = typeof stats.missing_count === 'number' ? stats.missing_count : undefined;
      let completePct;
      let missingPct;
      if (typeof score === 'number') {
        completePct = Math.max(0, Math.min(100, score));
        missingPct = 100 - completePct;
      } else if (typeof missingCount === 'number' && totalRows > 0) {
        missingPct = Math.max(0, Math.min(100, (missingCount / totalRows) * 100));
        completePct = 100 - missingPct;
      } else if (typeof stats.missing_percentage === 'number') {
        missingPct = Math.max(0, Math.min(100, stats.missing_percentage));
        completePct = 100 - missingPct;
      } else {
        completePct = 0;
        missingPct = 0;
      }
      normalizedCompleteness[col] = { completePct, missingPct };
    });
  }

  const completenessData = Object.entries(normalizedCompleteness).map(([column, v]) => ({
    column,
    completeness: Number.isFinite(v.completePct) ? Number(v.completePct.toFixed(2)) : 0,
    missing: Number.isFinite(v.missingPct) ? Number(v.missingPct.toFixed(2)) : 0,
  }));

  const dataTypes = dataInfo.data_types || dataInfo.column_types || {};
  const issues = dq.issues || dq.quality_issues || [];

  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Data Quality Overview</h3>

        {/* Completeness Chart */}
        <div className="mb-6">
          <h4 className="text-md font-medium mb-2">Data Completeness</h4>
          {completenessData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={completenessData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="column" tick={{ fill: '#9CA3AF', fontSize: 12 }} interval={0} angle={-15} dy={10} />
                <YAxis tick={{ fill: '#9CA3AF' }} domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completeness" fill="#4ade80" name="Complete %" />
                <Bar dataKey="missing" fill="#f87171" name="Missing %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm">No completeness details available.</p>
          )}
        </div>

        {/* Data Type Summary */}
        <div className="mb-6">
          <h4 className="text-md font-medium mb-2">Column Data Types</h4>
          {Object.keys(dataTypes).length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(dataTypes).map(([column, type]) => (
                <div key={column} className="flex justify-between bg-white/5 p-2 rounded">
                  <span className="font-medium">{column}</span>
                  <span className="text-gray-400">{String(type)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No data type information available.</p>
          )}
        </div>

        {/* Data Issues */}
        {Array.isArray(issues) && issues.length > 0 && (
          <div>
            <h4 className="text-md font-medium mb-2">Quality Issues</h4>
            <ul className="list-disc list-inside space-y-1">
              {issues.map((issue, index) => (
                <li key={index} className="text-yellow-400">{String(issue)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataQualityView;
