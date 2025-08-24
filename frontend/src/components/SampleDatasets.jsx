import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Database } from 'lucide-react'

const sampleFiles = [
  {
    name: 'Sales Data',
    file: 'sales_data.csv',
    description: 'Sample sales transactions with products, revenue, and discounts.'
  },
  {
    name: 'Employee Data',
    file: 'employee_data.csv',
    description: 'Employee records with department, salary, and performance.'
  },
  {
    name: 'Web Traffic Data',
    file: 'web_traffic_data.csv',
    description: 'Website analytics including visitors, bounce rate, and conversions.'
  }
]

const SampleDatasets = ({ onSampleUpload }) => {
  const [loadingFile, setLoadingFile] = useState(null)

  const loadSampleDataset = async (sample) => {
    setLoadingFile(sample.file)
    
    try {
      // Fetch the sample file from the sample_datasets directory
      const response = await fetch(`/sample_datasets/${sample.file}`)
      
      if (!response.ok) {
        throw new Error(`Failed to load ${sample.file}`)
      }
      
      const csvText = await response.text()
      
      // Create a File object from the CSV text
      const blob = new Blob([csvText], { type: 'text/csv' })
      const file = new File([blob], sample.file, { type: 'text/csv' })
      
      // Create FormData and upload
      const formData = new FormData()
      formData.append('file', file)
      
      const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/data/upload`, {
        method: 'POST',
        body: formData
      })
      
      const data = await uploadResponse.json()
      
      if (data.success) {
        onSampleUpload(data.data_info)
      } else {
        throw new Error(data.error || 'Upload failed')
      }
      
    } catch (error) {
      console.error('Sample upload error:', error)
      alert(`Failed to load ${sample.name}. Please try again.`)
    } finally {
      setLoadingFile(null)
    }
  }

  return (
    <div className="mt-8">
      <h4 className="text-lg font-semibold text-white mb-2">Or try a sample dataset:</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleFiles.map((sample) => (
          <motion.button
            key={sample.file}
            onClick={() => loadSampleDataset(sample)}
            disabled={loadingFile === sample.file}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="block w-full text-left bg-slate-800/60 border border-white/10 rounded-lg p-4 hover:bg-primary/10 hover:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-primary">{sample.name}</div>
              {loadingFile === sample.file ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              ) : (
                <Database className="w-4 h-4 text-primary/60" />
              )}
            </div>
            <div className="text-gray-300 text-sm mb-2">{sample.description}</div>
            <div className="text-xs text-gray-400">{sample.file}</div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default SampleDatasets
