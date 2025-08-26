import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ScatterChart, Scatter, PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  ScatterChart as ScatterChartIcon,
  PieChart as PieChartIcon
} from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

// High-contrast palette (first blue adjusted for dark bg visibility)
const COLORS = [
  '#3B82F6', // brighter blue (was #0088FE)
  '#10B981', // emerald
  '#F59E0B', // amber
  '#F97316', // orange
  '#A78BFA', // violet
  '#34D399', // green
  '#FBBF24', // yellow
  '#EC4899', // pink
  '#6366F1', // indigo
  '#F472B6'  // pink light
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 p-3 rounded-lg border border-white/10 shadow-xl">
        <p className="text-gray-300 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const VisualizationTypeSelector = ({ type, onTypeChange }) => (
  <div className="flex flex-wrap gap-4 mb-6">
    <button
      onClick={() => onTypeChange('bar')}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        type === 'bar'
          ? 'bg-primary text-white'
          : 'bg-slate-800/50 text-gray-400 hover:text-white'
      }`}
    >
      <BarChart3 className="w-4 h-4" />
      <span>Bar Chart</span>
    </button>
    <button
      onClick={() => onTypeChange('line')}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        type === 'line'
          ? 'bg-primary text-white'
          : 'bg-slate-800/50 text-gray-400 hover:text-white'
      }`}
    >
      <LineChartIcon className="w-4 h-4" />
      <span>Line Chart</span>
    </button>
    <button
      onClick={() => onTypeChange('scatter')}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        type === 'scatter'
          ? 'bg-primary text-white'
          : 'bg-slate-800/50 text-gray-400 hover:text-white'
      }`}
    >
      <ScatterChartIcon className="w-4 h-4" />
      <span>Scatter Plot</span>
    </button>
    <button
      onClick={() => onTypeChange('pie')}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        type === 'pie'
          ? 'bg-primary text-white'
          : 'bg-slate-800/50 text-gray-400 hover:text-white'
      }`}
    >
      <PieChartIcon className="w-4 h-4" />
      <span>Pie Chart</span>
    </button>
  </div>
);

const ColumnSelector = ({ columns, numericColumns = [], categoricalColumns = [], selectedColumns = [], onToggleColumn }) => {
  const columnTypes = useMemo(() => {
    if (!columns || !Array.isArray(columns)) return {};
    if (!numericColumns || !Array.isArray(numericColumns)) return {};
    
    return columns.reduce((types, col) => {
      types[col] = (numericColumns || []).includes(col) ? 'numeric' : 'categorical';
      return types;
    }, {});
  }, [columns, numericColumns]);

  return (
    <div className="space-y-4 mb-6">
      <div className="text-sm font-medium text-gray-400 mb-2">Select columns to visualize:</div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns?.map(column => (
          <motion.button
            key={column}
            onClick={() => onToggleColumn(column)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`text-sm px-3 py-2 rounded-lg transition-all ${
              selectedColumns.includes(column)
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-slate-800/50 border-white/10 text-gray-400 hover:text-white'
            } border flex items-center justify-between`}
          >
            <span>{column}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              columnTypes[column] === 'numeric' 
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-purple-500/20 text-purple-400'
            }`}>
              {columnTypes[column] === 'numeric' ? 'numeric' : 'text'}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const Chart = ({ data, type, columns }) => {
  if (!data || !columns || columns.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>Select columns to visualize</p>
        <p className="text-sm mt-2">Choose at least one column to create a visualization</p>
      </div>
    );
  }

  const chartData = useMemo(() => {
    if (type === 'pie' && columns.length >= 2) {
      // For pie charts, aggregate data by the first column
      const aggregated = data.reduce((acc, item) => {
        const key = item[columns[0]];
        acc[key] = (acc[key] || 0) + Number(item[columns[1]]);
        return acc;
      }, {});
      
      return Object.entries(aggregated).map(([name, value]) => ({
        name,
        value
      }));
    }
    return data;
  }, [data, columns, type]);

  const renderChart = () => {
    if (!data || !columns || columns.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400">
          <p>Select columns to visualize</p>
          <p className="text-sm mt-2">Choose at least one column to create a visualization</p>
        </div>
      );
    }

    switch (type) {
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey={columns[0]} 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              tickLine={{ stroke: '#4B5563' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              tickLine={{ stroke: '#4B5563' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
            {columns.slice(1).map((column, index) => (
              <Bar 
                key={column} 
                dataKey={column} 
                fill={column.toLowerCase().includes('temp') ? '#3B82F6' : // blue for temperature
                      column.toLowerCase().includes('condition') ? '#10B981' : // emerald for condition
                      COLORS[index % COLORS.length]} // fallback to color palette
              />
            ))}
          </BarChart>
        );

      case 'line':
        // Filter only numeric series (ignore text columns like categories)
        const numericSeries = columns.slice(1).filter(col =>
          chartData.some(row => {
            const v = row[col];
            return v !== null && v !== '' && !isNaN(Number(v));
          })
        );
        const skipped = columns.slice(1).filter(col => !numericSeries.includes(col));
        return (
          <>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey={columns[0]} 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              {numericSeries.map((column, index) => (
                <Line
                  key={column}
                  type="monotone"
                  dataKey={column}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={index === 0 ? 3 : 2}
                  dot={{ stroke: '#ffffff', strokeWidth: 1, fill: COLORS[index % COLORS.length], r: 5 }}
                  activeDot={{ r: 7 }}
                  isAnimationActive={true}
                />
              ))}
            </LineChart>
            {skipped.length > 0 && (
              <div className="mt-2 text-xs text-amber-400/80">
                Skipped non-numeric columns: {skipped.join(', ')}
              </div>
            )}
            {numericSeries.length === 0 && (
              <div className="mt-4 text-sm text-red-400">No numeric columns selected. Pick at least one numeric column.</div>
            )}
          </>
        );

      case 'scatter':
        if (columns.length < 2) {
          return <div className="text-gray-400">Select at least two numeric columns for a scatter plot</div>;
        }
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey={columns[0]} 
              name={columns[0]}
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              tickLine={{ stroke: '#4B5563' }}
            />
            <YAxis 
              dataKey={columns[1]}
              name={columns[1]}
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              tickLine={{ stroke: '#4B5563' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
            <Scatter
              name={`${columns[0]} vs ${columns[1]}`}
              data={chartData}
              fill={COLORS[0]}
            />
          </ScatterChart>
        );

      case 'pie':
        if (columns.length < 2) {
          return <div className="text-gray-400">Select two columns for a pie chart (category and value)</div>;
        }
        return (
          <PieChart>
            <Pie
              data={chartData}
              nameKey="name"
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#9CA3AF' }}
              formatter={(value, entry) => (
                <span style={{ color: '#9CA3AF' }}>{value}</span>
              )}
            />
          </PieChart>
        );

      default:
        return <div>Select a visualization type</div>;
    }
  };

  return (
    <ErrorBoundary>
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </ErrorBoundary>
  );
};

// Using the imported ErrorBoundary component instead of defining it here

const DataVisualizer = ({ 
  data = [], 
  columns = [], 
  numericColumns = [],
  categoricalColumns = [],
  selectedColumns = [], 
  type = 'bar', 
  onTypeChange, 
  onToggleColumn 
}) => {
  return (
    <div className="space-y-6">
      <VisualizationTypeSelector type={type} onTypeChange={onTypeChange} />
      <ColumnSelector 
        columns={columns} 
        selectedColumns={selectedColumns} 
        onToggleColumn={onToggleColumn}
        data={data}
      />
      <Chart 
        data={data} 
        type={type} 
        columns={selectedColumns}
      />
    </div>
  );
};

export default DataVisualizer;
