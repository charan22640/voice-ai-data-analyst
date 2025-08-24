import os
import requests
import json
from typing import Dict, Any

class GeminiService:
    def __init__(self):
        # Load API key and model configuration
        self.api_key = os.getenv('GEMINI_API_KEY')
        # Allow overriding model via env var (legacy names like gemini-pro may return 400)
        self.model = os.getenv('GEMINI_MODEL', 'gemini-1.5-flash')
        self.base_url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"
        )
        
    def generate_response(self, prompt: str, context: str = "") -> Dict[str, Any]:
        """Generate AI response using Gemini API"""
        # Lazy reload in case .env was loaded after service construction
        if not self.api_key:
            self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            return {"error": "Gemini API key not configured. Set GEMINI_API_KEY in your environment/.env and restart the backend."}
            
        headers = {
            "Content-Type": "application/json"
        }
        
        full_prompt = f"{context}\n\nUser: {prompt}" if context else prompt
        
        payload = {
            "contents": [{
                "parts": [{"text": full_prompt}]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1024
            }
        }
        
        try:
            response = requests.post(
                f"{self.base_url}?key={self.api_key}",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'candidates' in data and len(data['candidates']) > 0:
                    text = data['candidates'][0]['content']['parts'][0].get('text', '').strip()
                    if not text:
                        return {"error": "Empty response from model", "upstream": True}
                    return {"response": text, "status": "success"}
                else:
                    return {"error": "No candidates returned", "upstream": True, "raw": data}
            else:
                # Try to extract error message body
                err_text = ''
                try:
                    err_json = response.json()
                    err_text = err_json.get('error', {}).get('message') or str(err_json)
                except Exception:
                    err_text = response.text[:500]
                # Standardize invalid key detection to allow 401 mapping at route level
                if any(token in err_text.lower() for token in ["api key not valid", "invalid api key", "key is invalid", "permission denied"]):
                    err_text = "API key not valid. Please pass a valid API key."
                return {"error": f"API error: {response.status_code} {err_text}", "upstream": True}
                
        except Exception as e:
            return {"error": f"Request failed: {str(e)}", "upstream": True}
    
    def analyze_data_query(self, query: str, data_info: str) -> Dict[str, Any]:
        """Analyze natural language query for data operations"""
        context = f"""You are a data analysis assistant. Based on this dataset information:
{data_info}

Interpret the user's query and provide:
1. The type of analysis needed (correlation, trend, summary, distribution, etc.)
2. Specific columns/variables to analyze
3. Suggested visualization type
4. Brief explanation of what insights to look for

User query: {query}

Respond in JSON format with keys: analysis_type, columns, chart_type, explanation"""
        
        return self.generate_response(context)
    
    def explain_insights(self, analysis_results: Dict[str, Any]) -> str:
        """Generate human-readable explanation of data analysis results"""
        context = f"""Explain these data analysis results in simple, engaging language:
{json.dumps(analysis_results, indent=2)}

Provide key insights and what they mean for the user."""
        
        result = self.generate_response(context)
        return result.get('response', 'Unable to generate explanation')
