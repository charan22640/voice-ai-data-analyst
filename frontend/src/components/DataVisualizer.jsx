import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ScatterChart, Scatter, PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  ScatterChart as ScatterChartIcon,
  PieChart as PieChartIcon
} from 'lucide-react';

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

const ColumnSelector = ({ columns, selectedColumns, onToggleColumn }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    {columns?.map(column => (
      <button
        key={column}
        onClick={() => onToggleColumn(column)}
        className={`text-sm px-3 py-2 rounded-lg transition-all ${
          selectedColumns.includes(column)
            ? 'bg-primary/20 border-primary text-primary'
            : 'bg-slate-800/50 border-white/10 text-gray-400 hover:text-white'
        } border`}
      >
        {column}
      </button>
    ))}
  </div>
);

const Chart = ({ data, type, columns }) => {
  if (!data || !columns || columns.length === 0) {
    return <div className="text-gray-400">Select columns to visualize</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey={columns[0]} stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
              labelStyle={{ color: '#E5E7EB' }}
            />
            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
            {columns.slice(1).map((column, index) => (
              <Bar key={column} dataKey={column} fill={COLORS[index % COLORS.length]} />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey={columns[0]} stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
              labelStyle={{ color: '#E5E7EB' }}
            />
            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
            {columns.slice(1).map((column, index) => (
              <Line 
                key={column} 
                type="monotone" 
                dataKey={column} 
                stroke={COLORS[index % COLORS.length]} 
              />
            ))}
          </LineChart>
        );

      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey={columns[0]} stroke="#9CA3AF" />
            <YAxis dataKey={columns[1]} stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
              labelStyle={{ color: '#E5E7EB' }}
            />
            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
            <Scatter 
              name={`${columns[0]} vs ${columns[1]}`} 
              data={data} 
              fill={COLORS[0]} 
            />
          </ScatterChart>
        );

      case 'pie':
        const total = data.reduce((sum, item) => sum + Number(item[columns[1]] || 0), 0);
        const pieData = data.map(item => ({
          name: String(item[columns[0]]),
          value: (Number(item[columns[1]] || 0) / total) * 100
        }));

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name} (${value.toFixed(1)}%)`}
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
              labelStyle={{ color: '#E5E7EB' }}
            />
            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
          </PieChart>
        );

      default:
        return <div>Select a visualization type</div>;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

const DataVisualizer = ({ data, columns, selectedColumns, type, onTypeChange, onToggleColumn }) => {
  return (
    <div className="space-y-6">
      <VisualizationTypeSelector type={type} onTypeChange={onTypeChange} />
      <ColumnSelector 
        columns={columns} 
        selectedColumns={selectedColumns} 
        onToggleColumn={onToggleColumn}
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
