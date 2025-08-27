import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

const CorrelationMatrix = ({ data, columnTypes = {} }) => {
  const correlations = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return null;

    // Get numeric columns either from columnTypes or by inferring from first row
    let numericColumns = Object.entries(columnTypes)
      .filter(([_, type]) => type === 'number')
      .map(([col]) => col);

    if (numericColumns.length === 0) {
      const sample = data[0] || {};
      numericColumns = Object.keys(sample).filter((key) => {
        const val = Number(sample[key]);
        return typeof sample[key] !== 'object' && !isNaN(val) && isFinite(val);
      });
    }

    if (numericColumns.length < 2) return null;

    // Calculate correlations
    const correlationMatrix = {};
    numericColumns.forEach(col1 => {
      correlationMatrix[col1] = {};
      numericColumns.forEach(col2 => {
        if (col1 === col2) {
          correlationMatrix[col1][col2] = 1;
          return;
        }

  const values1 = data.map(row => Number(row[col1])).filter(val => !isNaN(val) && isFinite(val));
  const values2 = data.map(row => Number(row[col2])).filter(val => !isNaN(val) && isFinite(val));

        if (values1.length !== values2.length) {
          correlationMatrix[col1][col2] = 0;
          return;
        }

        // Calculate Pearson correlation
        const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
        const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;

        const variance1 = values1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0);
        const variance2 = values2.reduce((a, b) => a + Math.pow(b - mean2, 2), 0);

        const covariance = values1.reduce((a, b, i) => 
          a + ((b - mean1) * (values2[i] - mean2)), 0);

        const correlation = covariance / Math.sqrt(variance1 * variance2);
        correlationMatrix[col1][col2] = correlation;
      });
    });

    return correlationMatrix;
  }, [data, columnTypes]);

  if (!correlations) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>Not enough numeric columns for correlation analysis</p>
      </div>
    );
  }

  const getCorrelationColor = (value) => {
    const absValue = Math.abs(value);
    if (absValue > 0.7) return value > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
    if (absValue > 0.4) return value > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Network className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-white">Correlation Analysis</h3>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="bg-slate-800/50 rounded-lg border border-white/10 p-4">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-gray-400 p-2"></th>
                  {Object.keys(correlations).map(column => (
                    <th
                      key={column}
                      className="text-left text-sm font-medium text-gray-400 p-2"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(correlations).map(([row, cols]) => (
                  <tr key={row} className="border-t border-gray-700">
                    <td className="text-sm font-medium text-gray-300 p-2">{row}</td>
                    {Object.entries(cols).map(([col, value]) => (
                      <td key={col} className="p-2">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`inline-block px-2 py-1 rounded text-sm ${getCorrelationColor(value)}`}
                        >
                          {value.toFixed(2)}
                        </motion.div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
          <span className="text-xs text-gray-400">Strong Positive (&gt; 0.7)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500/20"></div>
          <span className="text-xs text-gray-400">Moderate Positive (0.4 - 0.7)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-500/20"></div>
          <span className="text-xs text-gray-400">Weak/No Correlation (&lt; 0.4)</span>
        </div>
      </div>
    </div>
  );
};

export default CorrelationMatrix;
