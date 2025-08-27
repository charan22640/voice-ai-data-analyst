import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ScatterChart, Scatter, PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
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

const ColumnSelector = ({ columns, columnTypes = {}, selectedColumns = [], onToggleColumn }) => {
  // columnTypes is now directly passed from the backend

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
              columnTypes[column] === 'number' 
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-purple-500/20 text-purple-400'
            }`}>
              {columnTypes[column] || 'text'}
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
    if (type === 'pie' && columns.length === 2) {
      // For pie chart, we need exactly 2 columns: one for categories and one for values
      const categoryColumn = columns[0];
      const valueColumn = columns[1];
      
      // Aggregate data by category
      const aggregated = data.reduce((acc, item) => {
        const key = item[categoryColumn];
        const value = Number(item[valueColumn]) || 0;
        if (!acc[key]) {
          acc[key] = { name: key, value: 0 };
        }
        acc[key].value += value;
        return acc;
      }, {});

      // Convert to array and sort by value
      return Object.values(aggregated).sort((a, b) => b.value - a.value);
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
        if (columns.length !== 2) {
          return (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg font-medium mb-4">Pie Chart Requirements:</p>
              <p className="mb-2">Please select exactly two columns:</p>
              <div className="inline-block text-left">
                <p className="text-sm mb-2">1. A category column for segments (e.g., day, condition)</p>
                <p className="text-sm">2. A numeric column for values (e.g., temperature, count)</p>
              </div>
              {columns.length > 2 && (
                <p className="mt-4 text-amber-400">
                  Too many columns selected. Please select only two columns.
                </p>
              )}
            </div>
          );
        }

        // Validate that the second column is numeric
        const hasValidNumericData = data.some(item => !isNaN(Number(item[columns[1]])));
        if (!hasValidNumericData) {
          return (
            <div className="text-center py-12 text-red-400">
              <p className="font-medium">Invalid Column Selection</p>
              <p className="text-sm mt-2">The second column must contain numeric values</p>
              <p className="text-sm mt-1">Current selection: {columns[1]}</p>
            </div>
          );
        }

        return (
          <div className="bg-slate-800/30 p-6 rounded-lg">
            <h3 className="text-center text-gray-300 mb-4 font-medium">
              {columns[1]} by {columns[0]}
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  nameKey="name"
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={160}
                  label={({ name, value, percent }) => 
                    `${name}: ${value.toLocaleString()} (${(percent * 100).toFixed(1)}%)`
                  }
                  labelLine={true}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`${entry.name}-${index}`} 
                      fill={entry.name.toLowerCase().includes('high') ? '#F59E0B' :
                           entry.name.toLowerCase().includes('low') ? '#3B82F6' :
                           COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip />}
                  formatter={(value) => value.toLocaleString()}
                />
                <Legend 
                  layout="horizontal"
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ 
                    color: '#9CA3AF',
                    paddingTop: '20px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
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
  columnTypes = {},
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
        columnTypes={columnTypes}
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
