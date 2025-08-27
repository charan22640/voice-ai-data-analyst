import os
import requests
import json
from typing import Dict, Any

class GeminiService:
    def __init__(self):
        # Load API key and model configuration
        self.api_key = os.getenv('GEMINI_API_KEY')
        # Define fallback model hierarchy
        self.models = [
            os.getenv('GEMINI_MODEL', 'gemini-1.5-flash'),
            'gemini-1.5-pro',
            'gemini-1.0-pro',
            'gemini-pro'  # Legacy fallback
        ]
        # Remove duplicates while preserving order
        self.models = list(dict.fromkeys(self.models))
        self.current_model = self.models[0]
        self.base_url_template = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        
    def generate_response(self, prompt: str, context: str = "") -> Dict[str, Any]:
        """Generate AI response using Gemini API with fallback models"""
        # Lazy reload in case .env was loaded after service construction
        if not self.api_key:
            self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            return {"error": "Gemini API key not configured. Set GEMINI_API_KEY in your environment/.env and restart the backend."}
            
        headers = {
            "Content-Type": "application/json"
        }
        
        # Enhanced system prompt for sophisticated data analysis
        system_prompt = """You are Nova, an advanced AI data analyst assistant. You excel at:
1. Dynamic data interpretation - Understanding any type of dataset through context
2. Intelligent analysis suggestions - Recommending relevant analyses based on data patterns
3. Professional insights - Providing clear, actionable insights in business context
4. Interactive exploration - Guiding users through progressive data discovery
5. Technical accuracy - Ensuring statistical validity and proper methodology

When analyzing data:
- Proactively identify patterns, trends, and anomalies
- Suggest relevant visualizations and statistical tests
- Explain insights in both technical and business terms
- Consider temporal aspects, seasonality, and relationships
- Flag data quality issues and their impact
- Adapt your analysis approach based on data type and user needs

Keep responses natural and direct, focusing on insights that matter."""
        
        if context:
            full_prompt = f"{system_prompt}\n\n{context}\n\nUser: {prompt}"
        else:
            full_prompt = f"{system_prompt}\n\nUser: {prompt}"
        
        payload = {
            "contents": [{
                "parts": [{"text": full_prompt}]
            }],
            "generationConfig": {
                "temperature": 0.4,  # Slightly higher for more nuanced analysis
                "topK": 40,  # Increased for broader context consideration
                "topP": 0.9,  # Increased for more nuanced responses
                "maxOutputTokens": 2048,  # Increased for detailed analysis
                # Avoid stopping on "**"; it appears in normal bold text and was truncating responses
                "stopSequences": ["Option", "Choice"]
            }
        }
        
        # Try each model in the fallback hierarchy
        last_error = None
        for model in self.models:
            try:
                base_url = self.base_url_template.format(model=model)
                response = requests.post(
                    f"{base_url}?key={self.api_key}",
                    headers=headers,
                    json=payload,
                    timeout=30
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if 'candidates' in data and len(data['candidates']) > 0:
                        text = data['candidates'][0]['content']['parts'][0].get('text', '').strip()
                        if not text:
                            last_error = {"error": "Empty response from model", "upstream": True}
                            continue
                        
                        # Clean up unwanted formatting
                        text = self._clean_response(text)
                        
                        # Update current model on success
                        self.current_model = model
                        return {"response": text, "status": "success", "model": model}
                    else:
                        last_error = {"error": "No candidates returned", "upstream": True, "raw": data}
                        continue
                else:
                    # Try to extract error message body
                    err_text = ''
                    try:
                        err_json = response.json()
                        err_text = err_json.get('error', {}).get('message') or str(err_json)
                    except Exception:
                        err_text = response.text[:500]
                    
                    # If it's an API key error, don't try other models
                    if any(token in err_text.lower() for token in ["api key not valid", "invalid api key", "key is invalid", "permission denied"]):
                        return {"error": "API key not valid. Please pass a valid API key.", "upstream": True}
                    
                    # For model-specific errors, try next model
                    if response.status_code in [400, 404]:
                        last_error = {"error": f"Model {model} failed: {response.status_code} {err_text}", "upstream": True}
                        continue
                    else:
                        last_error = {"error": f"API error: {response.status_code} {err_text}", "upstream": True}
                        continue
                        
            except Exception as e:
                last_error = {"error": f"Request failed with {model}: {str(e)}", "upstream": True}
                continue
        
        # If all models failed, return the last error
        return last_error or {"error": "All models failed", "upstream": True}
    
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
    
    def _clean_response(self, text: str) -> str:
        """Clean up response text to remove unwanted formatting"""
        import re
        
        # Remove markdown-style formatting
        text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # Remove **bold**
        text = re.sub(r'\*(.*?)\*', r'\1', text)      # Remove *italic*
        
        # Remove option listings if they appear
        lines = text.split('\n')
        cleaned_lines = []
        skip_section = False
        
        for line in lines:
            line = line.strip()
            # Skip sections that look like option listings
            if re.match(r'^\*\*Option \d+', line) or line.startswith('**Option'):
                skip_section = True
                continue
            elif re.match(r'^\*\*\w+:', line):  # Other ** formatted headers
                skip_section = True
                continue
            elif skip_section and (line == '' or not line.startswith('**')):
                skip_section = False
                if line:  # Don't add empty lines
                    cleaned_lines.append(line)
            elif not skip_section:
                cleaned_lines.append(line)
        
        # Join back and clean up extra whitespace
        cleaned_text = '\n'.join(cleaned_lines).strip()
        cleaned_text = re.sub(r'\n\s*\n\s*\n', '\n\n', cleaned_text)  # Remove multiple blank lines
        
        return cleaned_text
    
    def get_model_status(self) -> Dict[str, Any]:
        """Get information about available models and current model"""
        return {
            "available_models": self.models,
            "current_model": self.current_model,
            "api_key_configured": bool(self.api_key)
        }
    
    def set_model(self, model: str) -> Dict[str, Any]:
        """Manually set the current model"""
        if model in self.models:
            self.current_model = model
            # Move the selected model to the front of the list for priority
            self.models.remove(model)
            self.models.insert(0, model)
            return {"success": True, "current_model": model}
        else:
            return {"success": False, "error": f"Model {model} not available. Available models: {self.models}"}
