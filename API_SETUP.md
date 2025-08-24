# 🔑 API Setup Guide

## Getting Your Gemini API Key

### Step 1: Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Configure Environment
1. Open the `.env` file in the `backend` folder
2. Replace `your_actual_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=AIzaSyB...your_actual_key_here
   ```

### Step 3: Restart Backend
```bash
cd backend
python app.py
```

### Alternative: Set Environment Variable Temporarily
If you don't want to edit the .env file, you can set it temporarily:

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your_api_key_here"
python app.py
```

**Windows (Command Prompt):**
```cmd
set GEMINI_API_KEY=your_api_key_here
python app.py
```

**Linux/Mac:**
```bash
export GEMINI_API_KEY="your_api_key_here"
python app.py
```

## Testing the API
Once configured, test the API endpoints:
- http://localhost:5000/api/ai/status - Should show Gemini service as available
- Backend logs should not show any API key errors

## 🔒 Security Note
- Never commit your actual API key to version control
- The .env file is already in .gitignore
- Keep your API key secure and don't share it publicly
