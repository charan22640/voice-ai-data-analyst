from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from services.data_service import DataService
from services.gemini_service import GeminiService
import os
import uuid

data_bp = Blueprint('data', __name__)
data_service = DataService()
gemini_service = GeminiService()

ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@data_bp.route('/upload', methods=['POST'])
def upload():
    """Handle file upload and initial analysis"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not supported. Use CSV or Excel files.'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex[:8]}_{filename}"
        filepath = os.path.join('static', unique_filename)
        file.save(filepath)
        
        # Determine file type
        file_type = filename.rsplit('.', 1)[1].lower()
        
        # Load and analyze data
        result = data_service.load_data(filepath, file_type)
        
        if 'error' in result:
            # Clean up uploaded file
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify(result), 500
        
        # Add comprehensive analytics dashboard
        result['analytics_dashboard'] = data_service.get_analytics_dashboard()
        result['ai_dataset_context'] = data_service.get_ai_dataset_context()
        
        return jsonify({
            'success': True,
            'message': 'File uploaded and analyzed successfully',
            'filename': unique_filename,
            **result
        })
        
    except Exception as e:
        # Clean up uploaded file on error
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@data_bp.route('/query', methods=['POST'])
def query():
    """Process natural language data queries"""
    try:
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({'error': 'No query provided'}), 400
        
        user_query = data['query']
        include_explanation = data.get('include_explanation', True)
        
        # Process the query
        analysis_result = data_service.process_query(user_query)
        
        if 'error' in analysis_result:
            return jsonify(analysis_result), 500
        
        response_data = {
            'query': user_query,
            'analysis_type': analysis_result['analysis_type'],
            'results': analysis_result.get('results', {}),
            'chart_url': f"/static/{analysis_result['chart_path']}" if analysis_result.get('chart_path') else None,
            'insights': analysis_result.get('insights', ''),
            'status': 'success'
        }
        
        # Generate AI explanation if requested
        if include_explanation:
            ai_explanation = gemini_service.explain_insights(analysis_result)
            response_data['ai_explanation'] = ai_explanation
        
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({'error': f'Query processing failed: {str(e)}'}), 500

@data_bp.route('/info', methods=['GET'])
def info():
    """Return current dataset information"""
    try:
        if data_service.current_data is None:
            return jsonify({
                'loaded': False,
                'message': 'No dataset currently loaded'
            })
        
        return jsonify({
            'loaded': True,
            'info': data_service.data_info,
            'shape': data_service.current_data.shape,
            'columns': list(data_service.current_data.columns)
        })
        
    except Exception as e:
        return jsonify({'error': f'Info retrieval failed: {str(e)}'}), 500

@data_bp.route('/insights', methods=['POST'])
def insights():
    """Generate automated data insights"""
    try:
        if data_service.current_data is None:
            return jsonify({'error': 'No dataset loaded'}), 400
        
        # Generate comprehensive insights
        summary_result = data_service._generate_summary()
        correlation_result = data_service._analyze_correlation("correlation analysis")
        
        insights_data = {
            'summary': summary_result,
            'correlations': correlation_result if 'error' not in correlation_result else None
        }
        
        # Get AI interpretation
        ai_insights = gemini_service.explain_insights(insights_data)
        
        return jsonify({
            'automated_insights': insights_data,
            'ai_interpretation': ai_insights,
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({'error': f'Insights generation failed: {str(e)}'}), 500

@data_bp.route('/suggestions', methods=['GET'])
def suggestions():
    """Get query suggestions based on current dataset"""
    try:
        if data_service.current_data is None:
            return jsonify({
                'suggestions': [
                    "Upload a dataset to get started",
                    "Try uploading a CSV or Excel file"
                ]
            })
        
        info = data_service.data_info
        suggestions = []
        
        # Generate dynamic suggestions based on data
        if info['numeric_columns']:
            suggestions.extend([
                f"What's the average {info['numeric_columns'][0]}?",
                f"Show the distribution of {info['numeric_columns'][0]}",
                "Analyze correlations between numeric variables"
            ])
        
        if info['categorical_columns']:
            suggestions.append(f"Group data by {info['categorical_columns'][0]}")
        
        if len(info['numeric_columns']) > 1:
            suggestions.append(f"Compare {info['numeric_columns'][0]} vs {info['numeric_columns'][1]}")
        
        suggestions.extend([
            "Generate a summary of the dataset",
            "Show trends over time",
            "Detect any anomalies in the data"
        ])
        
        return jsonify({
            'suggestions': suggestions[:8]  # Limit to 8 suggestions
        })
        
    except Exception as e:
        return jsonify({'error': f'Suggestions generation failed: {str(e)}'}), 500

@data_bp.route('/analytics-dashboard', methods=['GET'])
def analytics_dashboard():
    """Get comprehensive analytics dashboard"""
    try:
        if data_service.current_data is None:
            return jsonify({'error': 'No dataset loaded'}), 400
        
        dashboard = data_service.get_analytics_dashboard()
        return jsonify({
            'success': True,
            'dashboard': dashboard
        })
        
    except Exception as e:
        return jsonify({'error': f'Dashboard generation failed: {str(e)}'}), 500

@data_bp.route('/ai-context', methods=['GET'])
def ai_context():
    """Get AI-readable dataset context"""
    try:
        if data_service.current_data is None:
            return jsonify({'error': 'No dataset loaded'}), 400
        
        context = data_service.get_ai_dataset_context()
        return jsonify({
            'success': True,
            'context': context
        })
        
    except Exception as e:
        return jsonify({'error': f'Context generation failed: {str(e)}'}), 500

@data_bp.route('/ai-query', methods=['POST'])
def ai_query():
    """Process AI queries about the dataset"""
    try:
        data = request.get_json()
        if not data or 'question' not in data:
            return jsonify({'error': 'No question provided'}), 400
        
        result = data_service.query_dataset_for_ai(data['question'])
        return jsonify({
            'success': True,
            **result
        })
        
    except Exception as e:
        return jsonify({'error': f'AI query failed: {str(e)}'}), 500

@data_bp.route('/statistics', methods=['GET'])
def statistics():
    """Get detailed statistics for all columns"""
    try:
        if data_service.current_data is None:
            return jsonify({'error': 'No dataset loaded'}), 400
        
        dashboard = data_service.get_analytics_dashboard()
        return jsonify({
            'success': True,
            'statistics': dashboard['summary_statistics']
        })
        
    except Exception as e:
        return jsonify({'error': f'Statistics generation failed: {str(e)}'}), 500
