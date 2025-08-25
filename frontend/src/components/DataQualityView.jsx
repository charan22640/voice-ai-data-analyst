import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DataQualityView = ({ dataInfo }) => {
  if (!dataInfo) return null;

  const { completeness, consistency, validity } = dataInfo.data_quality || {};

  // Create completeness chart data
  const completenessData = Object.entries(completeness || {}).map(([column, stats]) => ({
    column,
    completeness: 100 - stats.missing_percentage,
    missing: stats.missing_percentage
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Data Quality Overview</h3>
        
        {/* Completeness Chart */}
        <div className="mb-6">
          <h4 className="text-md font-medium mb-2">Data Completeness</h4>
          <BarChart width={600} height={300} data={completenessData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="column" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completeness" fill="#4ade80" name="Complete %" />
            <Bar dataKey="missing" fill="#f87171" name="Missing %" />
          </BarChart>
        </div>

        {/* Data Type Summary */}
        <div className="mb-6">
          <h4 className="text-md font-medium mb-2">Column Data Types</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(dataInfo.data_types || {}).map(([column, type]) => (
              <div key={column} className="flex justify-between bg-white/5 p-2 rounded">
                <span className="font-medium">{column}</span>
                <span className="text-gray-400">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Issues */}
        {dataInfo.data_quality?.issues?.length > 0 && (
          <div>
            <h4 className="text-md font-medium mb-2">Quality Issues</h4>
            <ul className="list-disc list-inside space-y-1">
              {dataInfo.data_quality.issues.map((issue, index) => (
                <li key={index} className="text-yellow-400">{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataQualityView;
