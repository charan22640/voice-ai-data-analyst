from flask import Blueprint, request, jsonify
from services.gemini_service import GeminiService
from services.tts_service import TTSService
from services.data_service import DataService
import os
import logging

ai_bp = Blueprint('ai', __name__)
gemini_service = GeminiService()
tts_service = TTSService()
# Try to reuse the shared DataService instance created in routes/data.py
try:
    from routes.data import data_service as shared_data_service  # type: ignore
    _shared_ds = shared_data_service
except Exception:
    _shared_ds = DataService()

@ai_bp.route('/process', methods=['POST'])
def process():
    """Process user input with Gemini AI"""
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'success': False, 'error': 'No message provided'}), 400
        
        message = data['message']
        context = data.get('context', '')
        
        # Get AI response
        result = gemini_service.generate_response(message, context)
        
        if 'error' in result:
            return jsonify({'success': False, **result}), 500
        
        response_data = {
            'response': result['response'],
            'status': 'success',
            'timestamp': data.get('timestamp')
        }
        
        # Generate TTS if requested
        if data.get('generate_audio', False):
            audio_file = tts_service.generate_speech(result['response'])
            if audio_file:
                response_data['audio_url'] = f"/static/{audio_file}"
        return jsonify({'success': True, **response_data})
    except Exception as e:
        return jsonify({'success': False, 'error': f'Processing failed: {str(e)}'}), 500

@ai_bp.route('/chat', methods=['POST'])
def chat():
    """Enhanced contextual chat with advanced data analysis capabilities"""
    try:
        data = request.get_json(silent=True) or {}
        message = data.get('message')
        if not message:
            return jsonify({'success': False, 'error': 'No message provided'}), 400
            
        # Extract context from request
        history = data.get('history', [])
        data_context = data.get('dataContext', {})
        
        # Build comprehensive analysis context
        analysis_context = {
            'message': message,
            'history': history[-5:],  # Last 5 messages for immediate context
            'data_summary': None,
            'suggested_analyses': [],
            'data_profile': None
        }
        
        # If we have data loaded, add data-specific context
        if data_context and 'success' in data_context:
            data_service = _shared_ds
            # Get rich data context safely
            try:
                analysis_context['data_summary'] = data_service.get_brief_summary()
                analysis_context['data_profile'] = data_service.get_data_profile()
                analysis_context['column_summaries'] = data_service.get_column_summaries()
                analysis_context['suggested_analyses'] = data_service.suggest_analyses(message)
            except Exception:
                pass

        conversation_history = data.get('history', [])

        # Build context from the last few messages (map frontend schema: type=user/assistant, content)
        history_window = conversation_history[-8:] if conversation_history else []
        context_lines = []
        for m in history_window:
            role = m.get('type')
            content = (m.get('content') or '').strip()
            if not content:
                continue
            if role == 'user':
                context_lines.append(f"User: {content}")
            elif role == 'assistant':
                context_lines.append(f"Assistant: {content}")

        context = "\n".join(context_lines[-12:])  # cap lines to avoid runaway context
        if context:
            context = f"Conversation so far (most recent last):\n{context}\n---\n"
        
        # Add dataset context if available
        try:
            data_service = _shared_ds
            if data_service.current_data is not None:
                dataset_context = data_service.get_ai_dataset_context()
                context += f"\nCurrent Dataset Context:\n{dataset_context}\n---\n"
        except Exception:
            pass  # Continue without dataset context if there's an error

        result = gemini_service.generate_response(message, context)

        if 'error' in result:
            # Differentiate upstream (Gemini) errors vs local validation
            err_msg = (result.get('error') or '').lower()
            if 'api key not valid' in err_msg or 'invalid api key' in err_msg:
                status_code = 401  # Unauthorized
            else:
                status_code = 502 if result.get('upstream') else 500
            return jsonify({'success': False, **result}), status_code

        return jsonify({
            'success': True,
            'response': result['response'],
            'status': 'success'
        })

    except Exception as e:
        logging.exception("Chat endpoint failed")
        return jsonify({'success': False, 'error': f'Chat failed: {str(e)}'}), 500

@ai_bp.route('/tts', methods=['POST'])
def tts():
    """Generate text-to-speech audio"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'success': False, 'error': 'No text provided'}), 400
        
        text = data['text']
        language = data.get('lang', 'en')
        
        audio_file = tts_service.generate_speech(text, language)
        
        if audio_file:
            return jsonify({
                'success': True,
                'audio_url': f"/static/{audio_file}",
                'status': 'success'
            })
        else:
            return jsonify({'success': False, 'error': 'TTS generation failed'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'error': f'TTS failed: {str(e)}'}), 500

@ai_bp.route('/status', methods=['GET', 'OPTIONS'])
def status():
    if request.method == 'OPTIONS':
        return ('', 204)
    """AI service health check (lightweight)"""
    api_key_ok = bool(os.getenv('GEMINI_API_KEY'))
    model_status = gemini_service.get_model_status()
    
    return jsonify({
        'success': True,
        'status': 'healthy',
        'services': {
            'gemini_api_key': 'configured' if api_key_ok else 'missing',
            'tts': 'ready'
        },
        'api_key_configured': api_key_ok,
        'model_info': model_status
    })

@ai_bp.route('/model', methods=['POST', 'GET'])
def model():
    """Get or set the current AI model"""
    if request.method == 'GET':
        return jsonify({
            'success': True,
            **gemini_service.get_model_status()
        })
    
    try:
        data = request.get_json()
        if not data or 'model' not in data:
            return jsonify({'success': False, 'error': 'No model specified'}), 400
        
        result = gemini_service.set_model(data['model'])
        if result['success']:
            return jsonify({'success': True, **result})
        else:
            return jsonify({'success': False, **result}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': f'Model switch failed: {str(e)}'}), 500
