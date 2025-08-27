import React, { useState, useRef, useCallback, useEffect } from 'react'
import SampleDatasets from './SampleDatasets'
import DataVisualizer from './DataVisualizer'
import DataQualityView from './DataQualityView'
import DataOverview from './DataOverview'
import ErrorBoundary from './ErrorBoundary'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, FileText, BarChart3, Search, X, Loader2, 
  TrendingUp, Database, PieChart, LineChart, 
  ScatterChart, CheckCircle, Table 
} from 'lucide-react'

const QueryInterface = ({ query, setQuery, analyzeQuery, isAnalyzing }) => (
  <div className="space-y-4">
    <div className="flex items-center space-x-3 mb-4">
      <Search className="w-5 h-5 text-primary" />
      <h3 className="text-lg font-semibold text-white">Query Your Data</h3>
    </div>

    <div className="flex space-x-3">
      <div className="flex-1">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask questions about your data in natural language..."
          className="w-full bg-slate-800/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all"
          rows={2}
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={analyzeQuery}
        disabled={!query.trim() || isAnalyzing}
        className="bg-primary hover:bg-primary/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-primary/25 flex items-center space-x-2"
      >
        {isAnalyzing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <TrendingUp className="w-5 h-5" />
        )}
        <span>Analyze</span>
      </motion.button>
    </div>
  </div>
);

const QueryResults = ({ results }) => {
  const insightsArray = Array.isArray(results.insights)
    ? results.insights
    : typeof results.insights === 'string' && results.insights.trim()
      ? [results.insights]
      : []
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Analysis Results</h3>
      {results.explanation && (
        <div className="bg-slate-800/50 rounded-lg p-4 mb-4 border border-white/10">
          <h4 className="font-medium text-white mb-2">AI Explanation</h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {results.explanation}
          </p>
        </div>
      )}
      {insightsArray.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-white">Key Insights:</h4>
          {insightsArray.map((insight, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
};

const DatasetStats = ({ datasetInfo }) => (
  <div className="grid grid-cols-3 gap-4">
    <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-white/10">
      <div className="text-2xl font-bold text-primary">{datasetInfo.numeric_columns?.length || 0}</div>
      <div className="text-sm text-gray-400">Numeric Columns</div>
    </div>
    <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-white/10">
      <div className="text-2xl font-bold text-blue-400">{datasetInfo.categorical_columns?.length || 0}</div>
      <div className="text-sm text-gray-400">Text Columns</div>
    </div>
    <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-white/10">
      <div className="text-2xl font-bold text-purple-400">{datasetInfo.total_rows || datasetInfo.rows || 0}</div>
      <div className="text-sm text-gray-400">Total Rows</div>
    </div>
  </div>
);

const DatasetHeader = ({ activeTab, setActiveTab }) => (
  <div className="mb-6">
    <div className="flex space-x-2 border-b border-gray-700">
      <button
        onClick={() => setActiveTab('overview')}
        className={`px-4 py-2 flex items-center space-x-2 ${
          activeTab === 'overview' 
            ? 'text-primary border-b-2 border-primary' 
            : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <FileText className="w-4 h-4" />
        <span>Overview</span>
      </button>
      <button
        onClick={() => setActiveTab('visualizations')}
        className={`px-4 py-2 flex items-center space-x-2 ${
          activeTab === 'visualizations'
            ? 'text-primary border-b-2 border-primary'
            : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        <span>Visualizations</span>
      </button>
      <button
        onClick={() => setActiveTab('quality')}
        className={`px-4 py-2 flex items-center space-x-2 ${
          activeTab === 'quality'
            ? 'text-primary border-b-2 border-primary'
            : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <CheckCircle className="w-4 h-4" />
        <span>Data Quality</span>
      </button>
      <button
        onClick={() => setActiveTab('explore')}
        className={`px-4 py-2 flex items-center space-x-2 ${
          activeTab === 'explore'
            ? 'text-primary border-b-2 border-primary'
            : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <Search className="w-4 h-4" />
        <span>Explore</span>
      </button>
    </div>
  </div>
);

const DataDashboard = ({ onDatasetLoaded }) => {
  const [datasetInfo, setDatasetInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [queryResults, setQueryResults] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedColumns, setSelectedColumns] = useState([])
  const [visualizationType, setVisualizationType] = useState('bar')
  const [summaryStats, setSummaryStats] = useState(null)
  const [dataQuality, setDataQuality] = useState(null)
  const [explorationView, setExplorationView] = useState('table')
  const fileInputRef = useRef(null)

  // Initialize selected columns when dataset changes
  useEffect(() => {
    if (datasetInfo?.columns?.length > 0) {
      // For bar charts, select first categorical and first numeric column by default
      const defaultCategorical = datasetInfo.categorical_columns?.[0]
      const defaultNumeric = datasetInfo.numeric_columns?.[0]
      if (defaultCategorical && defaultNumeric) {
        setSelectedColumns([defaultCategorical, defaultNumeric])
      } else {
        // Fallback to first two columns if categorization is not available
        setSelectedColumns([datasetInfo.columns[0], datasetInfo.columns[1]].filter(Boolean))
      }
    }
  }, [datasetInfo])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      uploadFile(files[0])
    }
  }, [])

  const uploadFile = async (file) => {
    if (!file) return
    
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv')) { // Added check for .csv extension
      alert('Please upload a CSV or Excel file')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/data/upload`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        setDatasetInfo(data)
        if (data.columns && data.columns.length > 0) {
          setSelectedColumns([data.columns[0]])
        }
        setActiveTab('overview')
        onDatasetLoaded(data)
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      uploadFile(file)
    }
  }

  // Fetch data quality and summary stats when dataset is loaded or tab changes
  useEffect(() => {
    if (datasetInfo) {
      if (activeTab === 'quality') {
        fetchDataQuality()
      }
      if (activeTab === 'overview') {
        fetchSummaryStats()
      }
      if (activeTab === 'visualizations') {
        // Reset visualization state when switching to visualization tab
        setSelectedColumns([])
        setVisualizationType('bar')
      }
    }
  }, [datasetInfo, activeTab])

  const analyzeQuery = async () => {
    if (!query.trim() || !datasetInfo) return
    
    setIsAnalyzing(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/data/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      const data = await response.json()
      // The backend currently returns { status: 'success', ... } NOT { success: true }
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Analysis failed')
      }

      const transformed = {
        ...data,
        // Normalized fields for QueryResults component (override any raw values)
        explanation: data.ai_explanation || data.explanation || '',
        insights: Array.isArray(data.insights)
          ? data.insights
          : (typeof data.insights === 'string' && data.insights.trim())
            ? [data.insights]
            : []
      }
      setQueryResults(transformed)
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Failed to analyze query. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearDataset = () => {
    setDatasetInfo(null)
    setQueryResults(null)
    setQuery('')
    setSelectedColumns([])
    setDataQuality(null)
    setSummaryStats(null)
    onDatasetLoaded(null)
  }

  const toggleColumnSelection = (column) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column)
        : [...prev, column]
    )
  }

  const fetchDataQuality = async () => {
    if (!datasetInfo) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/data/quality`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setDataQuality(data.quality)
      } else {
        console.error('Data quality fetch failed:', data.error)
      }
    } catch (error) {
      console.error('Failed to fetch data quality:', error)
      setDataQuality(null)
    }
  }

  const fetchSummaryStats = async () => {
    if (!datasetInfo) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/data/summary`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setSummaryStats(data.summary)
      } else {
        console.error('Summary stats fetch failed:', data.error)
      }
    } catch (error) {
      console.error('Failed to fetch summary stats:', error)
      setSummaryStats(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Data Analysis</h2>
        <p className="text-gray-400">Upload datasets and query them with natural language</p>
      </motion.div>

      {datasetInfo && <DatasetHeader activeTab={activeTab} setActiveTab={setActiveTab} />}

      {!datasetInfo ? (
        <>
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div
              className={`glass rounded-2xl p-12 text-center border-2 border-dashed transition-all duration-300 ${
                dragActive
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-white/20 hover:border-white/40'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <AnimatePresence>
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
                    <p className="text-white text-lg">Processing your dataset...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="relative">
                      <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
                      {dragActive && (
                        <motion.div
                          className="absolute inset-0 bg-primary/20 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Upload Your Dataset
                      </h3>
                      <p className="text-gray-400 mb-6">
                        Drag and drop your CSV or Excel file here, or click to browse
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg shadow-primary/25"
                    >
                      Choose File
                    </motion.button>
                    <div className="flex justify-center space-x-8 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>CSV</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>Excel</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          {/* Sample Datasets Section */}
          <SampleDatasets onSampleUpload={(dataInfo) => {
            setDatasetInfo(dataInfo)
            onDatasetLoaded(dataInfo)
          }} />
        </>
      ) : (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {activeTab === 'overview' ? 'Dataset Overview' :
                   activeTab === 'visualizations' ? 'Data Visualization' :
                   activeTab === 'quality' ? 'Data Quality Analysis' :
                   'Dataset Explorer'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {activeTab === 'overview' ? 'View dataset statistics and information' :
                   activeTab === 'visualizations' ? 'Create visualizations from your data' :
                   activeTab === 'quality' ? 'Check data quality and issues' :
                   'Explore and analyze your data'}
                </p>
              </div>
              <button
                onClick={clearDataset}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeTab === 'overview' && (
              <DataOverview datasetInfo={datasetInfo} />
            )}
            {activeTab === 'visualizations' && (
              <ErrorBoundary>
                <DataVisualizer 
                  data={datasetInfo?.data || []}
                  columns={datasetInfo?.columns || []}
                  numericColumns={datasetInfo?.numeric_columns || []}
                  categoricalColumns={datasetInfo?.categorical_columns || []}
                  columnTypes={datasetInfo?.column_types || {}}
                  selectedColumns={selectedColumns}
                  type={visualizationType}
                  onTypeChange={setVisualizationType}
                  onToggleColumn={toggleColumnSelection}
                />
              </ErrorBoundary>
            )}
            {activeTab === 'quality' && (
              <DataQualityView dataQuality={datasetInfo.data_quality} />
            )}
            {activeTab === 'explore' && (
              <div className="space-y-6">
                <DatasetStats datasetInfo={datasetInfo} />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-6"
          >
            <QueryInterface 
              query={query}
              setQuery={setQuery}
              analyzeQuery={analyzeQuery}
              isAnalyzing={isAnalyzing}
            />
          </motion.div>

          <AnimatePresence>
            {queryResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass rounded-xl p-6"
              >
                <QueryResults results={queryResults} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default DataDashboard
