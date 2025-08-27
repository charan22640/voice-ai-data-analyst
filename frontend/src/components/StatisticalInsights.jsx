import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Activity, 
  AlertCircle, ArrowUpRight, ArrowDownRight,
  BarChart2, Hash
} from 'lucide-react';

const StatCard = ({ title, value, trend, description, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`bg-slate-800/50 p-4 rounded-lg border border-${color}/20`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <h4 className={`text-xl font-semibold text-${color}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h4>
      </div>
      {trend && (
        <div className={`flex items-center space-x-1 text-${trend > 0 ? 'green' : 'red'}-400`}>
          {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span className="text-sm">{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    {description && (
      <p className="text-xs text-gray-500 mt-2">{description}</p>
    )}
  </motion.div>
);

const StatisticalInsights = ({ data, columnTypes }) => {
  // Calculate statistical insights
  const getColumnStats = (columnName) => {
    const values = data.map(row => Number(row[columnName])).filter(val => !isNaN(val));
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const q1 = sorted[Math.floor(sorted.length / 4)];
    const q3 = sorted[Math.floor(3 * sorted.length / 4)];
    const stdDev = Math.sqrt(
      values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    );

    return {
      mean,
      median,
      min,
      max,
      q1,
      q3,
      stdDev,
      range: max - min,
      iqr: q3 - q1
    };
  };

  // Get numeric columns
  const numericColumns = Object.entries(columnTypes)
    .filter(([_, type]) => type === 'number')
    .map(([col]) => col);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {numericColumns.map(column => {
          const stats = getColumnStats(column);
          if (!stats) return null;

          return (
            <div key={column} className="space-y-4">
              <h3 className="text-white font-medium flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>{column} Statistics</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  title="Mean"
                  value={stats.mean.toFixed(2)}
                  color="blue"
                />
                <StatCard
                  title="Median"
                  value={stats.median.toFixed(2)}
                  color="purple"
                />
                <StatCard
                  title="Std Dev"
                  value={stats.stdDev.toFixed(2)}
                  color="green"
                />
                <StatCard
                  title="Range"
                  value={stats.range.toFixed(2)}
                  color="amber"
                />
                <StatCard
                  title="Q1 - Q3"
                  value={`${stats.q1.toFixed(1)} - ${stats.q3.toFixed(1)}`}
                  color="indigo"
                />
                <StatCard
                  title="IQR"
                  value={stats.iqr.toFixed(2)}
                  color="pink"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Data Quality Indicators */}
      <div className="mt-8">
        <h3 className="text-white font-medium mb-4 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>Data Quality Indicators</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(columnTypes).map(([column, type]) => {
            const nonNullCount = data.filter(row => row[column] !== null && row[column] !== undefined && row[column] !== '').length;
            const completeness = (nonNullCount / data.length) * 100;
            const uniqueCount = new Set(data.map(row => row[column])).size;
            const uniqueness = (uniqueCount / data.length) * 100;

            return (
              <motion.div
                key={column}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 p-4 rounded-lg border border-white/10"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-gray-300 font-medium">{column}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    type === 'number' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {type}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Completeness</span>
                    <span className="text-gray-300">{completeness.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">Unique Values</span>
                    <span className="text-gray-300">{uniqueCount.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatisticalInsights;
