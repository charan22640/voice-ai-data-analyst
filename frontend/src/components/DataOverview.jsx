import React from 'react';
import { Table } from 'lucide-react';

const DataOverview = ({ datasetInfo }) => {
  if (!datasetInfo || !datasetInfo.info) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Dataset Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700/50 p-3 rounded">
            <p className="text-gray-400">Total Rows</p>
            <p className="text-xl text-white">{datasetInfo.info.total_rows}</p>
          </div>
          <div className="bg-gray-700/50 p-3 rounded">
            <p className="text-gray-400">Total Columns</p>
            <p className="text-xl text-white">{datasetInfo.info.total_columns}</p>
          </div>
        </div>
      </div>

      {/* Column Information */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Columns</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-4 text-gray-400">Name</th>
                <th className="text-left py-2 px-4 text-gray-400">Type</th>
                <th className="text-left py-2 px-4 text-gray-400">Missing Values</th>
                <th className="text-left py-2 px-4 text-gray-400">Sample Values</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(datasetInfo.data_types || {}).map(([column, type]) => (
                <tr key={column} className="border-b border-gray-700/50">
                  <td className="py-2 px-4 text-white">{column}</td>
                  <td className="py-2 px-4 text-gray-300">{type}</td>
                  <td className="py-2 px-4 text-gray-300">
                    {datasetInfo.info.missing_values?.[column] || 0}
                  </td>
                  <td className="py-2 px-4 text-gray-300">
                    {(datasetInfo.info.sample_data && 
                      datasetInfo.info.sample_data[0]?.[column]) || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sample Data */}
      {datasetInfo.info.sample_data && (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Sample Data</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  {Object.keys(datasetInfo.info.sample_data[0] || {}).map(header => (
                    <th key={header} className="text-left py-2 px-4 text-gray-400">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datasetInfo.info.sample_data.map((row, index) => (
                  <tr key={index} className="border-b border-gray-700/50">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="py-2 px-4 text-gray-300">
                        {value?.toString() || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataOverview;
