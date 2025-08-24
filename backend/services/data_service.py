import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend
import matplotlib.pyplot as plt
import plotly.express as px
import plotly.graph_objects as go
import seaborn as sns
import os
import json
from io import StringIO
from typing import Dict, Any, Tuple, Optional
import uuid
from datetime import datetime

# Set dark theme for matplotlib
plt.style.use('dark_background')
sns.set_theme(style="darkgrid", palette="viridis")

class DataService:
    def __init__(self, static_dir: str = 'static'):
        self.static_dir = static_dir
        self.current_data = None
        self.data_info = {}
        
    def load_data(self, file_path: str, file_type: str = 'csv') -> Dict[str, Any]:
        """Load dataset from file"""
        try:
            if file_type.lower() == 'csv':
                self.current_data = pd.read_csv(file_path)
            elif file_type.lower() in ['xlsx', 'xls']:
                self.current_data = pd.read_excel(file_path)
            else:
                return {"error": "Unsupported file type"}
            
            # Generate data info
            self.data_info = self._generate_data_info()
            
            return {
                "success": True,
                "shape": self.current_data.shape,
                "columns": list(self.current_data.columns),
                "data_types": self.current_data.dtypes.to_dict(),
                "info": self.data_info
            }
            
        except Exception as e:
            return {"error": f"Failed to load data: {str(e)}"}
    
    def _generate_data_info(self) -> Dict[str, Any]:
        """Generate comprehensive dataset information"""
        if self.current_data is None:
            return {}
            
        numeric_cols = self.current_data.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = self.current_data.select_dtypes(include=['object']).columns.tolist()
        
        info = {
            "total_rows": len(self.current_data),
            "total_columns": len(self.current_data.columns),
            "numeric_columns": numeric_cols,
            "categorical_columns": categorical_cols,
            "missing_values": self.current_data.isnull().sum().to_dict(),
            "sample_data": self.current_data.head().to_dict('records')
        }
        
        return info
    
    def process_query(self, query: str) -> Dict[str, Any]:
        """Process natural language data query"""
        if self.current_data is None:
            return {"error": "No dataset loaded"}
            
        query_lower = query.lower()
        
        # Determine query type and execute analysis
        if any(word in query_lower for word in ['average', 'mean', 'avg']):
            return self._calculate_averages(query)
        elif any(word in query_lower for word in ['correlation', 'correlate', 'relationship']):
            return self._analyze_correlation(query)
        elif any(word in query_lower for word in ['trend', 'trends', 'time', 'over time']):
            return self._analyze_trends(query)
        elif any(word in query_lower for word in ['distribution', 'histogram', 'spread']):
            return self._analyze_distribution(query)
        elif any(word in query_lower for word in ['summary', 'describe', 'overview']):
            return self._generate_summary()
        else:
            return self._general_analysis(query)
    
    def _calculate_averages(self, query: str) -> Dict[str, Any]:
        """Calculate averages based on query"""
        numeric_cols = self.current_data.select_dtypes(include=[np.number]).columns
        
        if len(numeric_cols) == 0:
            return {"error": "No numeric columns found"}
        
        # Simple average calculation
        averages = self.current_data[numeric_cols].mean().to_dict()
        
        # Generate visualization
        chart_path = self._create_bar_chart(
            x=list(averages.keys()),
            y=list(averages.values()),
            title="Average Values by Column",
            xlabel="Columns",
            ylabel="Average Value"
        )
        
        return {
            "analysis_type": "averages",
            "results": averages,
            "chart_path": chart_path,
            "insights": f"Calculated averages for {len(averages)} numeric columns"
        }
    
    def _analyze_correlation(self, query: str) -> Dict[str, Any]:
        """Analyze correlations between variables"""
        numeric_data = self.current_data.select_dtypes(include=[np.number])
        
        if len(numeric_data.columns) < 2:
            return {"error": "Need at least 2 numeric columns for correlation analysis"}
        
        correlation_matrix = numeric_data.corr()
        
        # Generate heatmap
        chart_path = self._create_correlation_heatmap(correlation_matrix)
        
        # Find strong correlations
        strong_corr = []
        for i in range(len(correlation_matrix.columns)):
            for j in range(i+1, len(correlation_matrix.columns)):
                corr_val = correlation_matrix.iloc[i, j]
                if abs(corr_val) > 0.5:
                    strong_corr.append({
                        'var1': correlation_matrix.columns[i],
                        'var2': correlation_matrix.columns[j],
                        'correlation': round(corr_val, 3)
                    })
        
        return {
            "analysis_type": "correlation",
            "correlation_matrix": correlation_matrix.to_dict(),
            "strong_correlations": strong_corr,
            "chart_path": chart_path,
            "insights": f"Found {len(strong_corr)} strong correlations (|r| > 0.5)"
        }
    
    def _analyze_trends(self, query: str) -> Dict[str, Any]:
        """Analyze trends in data"""
        numeric_cols = self.current_data.select_dtypes(include=[np.number]).columns
        
        if len(numeric_cols) == 0:
            return {"error": "No numeric columns for trend analysis"}
        
        # Simple trend analysis - assume first column is time-like or use index
        x_data = range(len(self.current_data))
        y_data = self.current_data[numeric_cols[0]]
        
        chart_path = self._create_line_chart(
            x=x_data,
            y=y_data,
            title=f"Trend Analysis: {numeric_cols[0]}",
            xlabel="Data Points",
            ylabel=numeric_cols[0]
        )
        
        # Calculate basic trend metrics
        slope = np.polyfit(x_data, y_data, 1)[0]
        trend_direction = "increasing" if slope > 0 else "decreasing"
        
        return {
            "analysis_type": "trend",
            "trend_direction": trend_direction,
            "slope": float(slope),
            "chart_path": chart_path,
            "insights": f"Data shows {trend_direction} trend with slope {slope:.4f}"
        }
    
    def _analyze_distribution(self, query: str) -> Dict[str, Any]:
        """Analyze data distribution"""
        numeric_cols = self.current_data.select_dtypes(include=[np.number]).columns
        
        if len(numeric_cols) == 0:
            return {"error": "No numeric columns for distribution analysis"}
        
        col = numeric_cols[0]
        data = self.current_data[col].dropna()
        
        # Generate histogram
        chart_path = self._create_histogram(data, col)
        
        # Calculate distribution statistics
        stats = {
            "mean": float(data.mean()),
            "median": float(data.median()),
            "std": float(data.std()),
            "min": float(data.min()),
            "max": float(data.max()),
            "skewness": float(data.skew()),
            "kurtosis": float(data.kurtosis())
        }
        
        return {
            "analysis_type": "distribution",
            "column": col,
            "statistics": stats,
            "chart_path": chart_path,
            "insights": f"Distribution analysis for {col}: mean={stats['mean']:.2f}, std={stats['std']:.2f}"
        }
    
    def _generate_summary(self) -> Dict[str, Any]:
        """Generate dataset summary"""
        summary = self.current_data.describe(include='all').to_dict()
        
        # Create summary visualization
        numeric_cols = self.current_data.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            means = self.current_data[numeric_cols].mean()
            chart_path = self._create_bar_chart(
                x=list(means.index),
                y=list(means.values),
                title="Summary: Mean Values",
                xlabel="Columns",
                ylabel="Mean Value"
            )
        else:
            chart_path = None
        
        return {
            "analysis_type": "summary",
            "summary_statistics": summary,
            "data_info": self.data_info,
            "chart_path": chart_path,
            "insights": f"Dataset with {self.data_info['total_rows']} rows and {self.data_info['total_columns']} columns"
        }
    
    def _general_analysis(self, query: str) -> Dict[str, Any]:
        """General analysis fallback"""
        return self._generate_summary()
    
    def _create_bar_chart(self, x, y, title, xlabel, ylabel) -> str:
        """Create bar chart and return file path"""
        plt.figure(figsize=(10, 6))
        plt.bar(x, y, color='#00ff9f', alpha=0.7)
        plt.title(title, color='white', fontsize=16)
        plt.xlabel(xlabel, color='white')
        plt.ylabel(ylabel, color='white')
        plt.xticks(rotation=45, color='white')
        plt.yticks(color='white')
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        filename = f"bar_chart_{uuid.uuid4().hex[:8]}.png"
        filepath = os.path.join(self.static_dir, filename)
        plt.savefig(filepath, facecolor='#1a1a2e', dpi=150, bbox_inches='tight')
        plt.close()
        
        return filename
    
    def _create_line_chart(self, x, y, title, xlabel, ylabel) -> str:
        """Create line chart and return file path"""
        plt.figure(figsize=(10, 6))
        plt.plot(x, y, color='#00ff9f', linewidth=2, marker='o', markersize=4)
        plt.title(title, color='white', fontsize=16)
        plt.xlabel(xlabel, color='white')
        plt.ylabel(ylabel, color='white')
        plt.xticks(color='white')
        plt.yticks(color='white')
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        filename = f"line_chart_{uuid.uuid4().hex[:8]}.png"
        filepath = os.path.join(self.static_dir, filename)
        plt.savefig(filepath, facecolor='#1a1a2e', dpi=150, bbox_inches='tight')
        plt.close()
        
        return filename
    
    def _create_correlation_heatmap(self, corr_matrix) -> str:
        """Create correlation heatmap"""
        plt.figure(figsize=(10, 8))
        sns.heatmap(corr_matrix, annot=True, cmap='viridis', center=0,
                   square=True, linewidths=0.5, cbar_kws={"shrink": .5})
        plt.title('Correlation Matrix', color='white', fontsize=16)
        plt.tight_layout()
        
        filename = f"heatmap_{uuid.uuid4().hex[:8]}.png"
        filepath = os.path.join(self.static_dir, filename)
        plt.savefig(filepath, facecolor='#1a1a2e', dpi=150, bbox_inches='tight')
        plt.close()
        
        return filename
    
    def _create_histogram(self, data, column_name) -> str:
        """Create histogram"""
        plt.figure(figsize=(10, 6))
        plt.hist(data, bins=30, color='#00ff9f', alpha=0.7, edgecolor='white')
        plt.title(f'Distribution of {column_name}', color='white', fontsize=16)
        plt.xlabel(column_name, color='white')
        plt.ylabel('Frequency', color='white')
        plt.xticks(color='white')
        plt.yticks(color='white')
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        filename = f"histogram_{uuid.uuid4().hex[:8]}.png"
        filepath = os.path.join(self.static_dir, filename)
        plt.savefig(filepath, facecolor='#1a1a2e', dpi=150, bbox_inches='tight')
        plt.close()
        
        return filename
