# Nova – Voice‑Activated AI Data Analyst

Nova is a full‑stack AI data assistant that lets you upload CSV/Excel files, ask questions in natural language (voice or text), and receive insights, summaries, and visualizations. The project demonstrates end‑to‑end skills across modern React UI, Python/Flask analytics, and LLM integration.

## Highlights
- Voice chat with STT/TTS, conversational memory
- Natural‑language analysis of structured data (CSV/XLS/XLSX)
- Automated stats, correlations, distributions, outlier scans, and quality reports
- On‑the‑fly charts (Matplotlib/Seaborn/Plotly) served from the backend
- Gemini API integration with robust fallbacks and response cleaning
- Modern UI (Tailwind + Framer Motion), dark theme, responsive

## Architecture
- Frontend: React 18 + Vite, Tailwind CSS, Framer Motion
- Backend: Flask (Python 3.11+), Pandas/NumPy, Plotly/Matplotlib/Seaborn
- AI: Google Gemini API (configurable), server‑side prompt assembly and safety guards
- TTS: Server‑side generation (gTTS pipeline) with frontend playback
- Packaging: Dockerfiles (frontend/backend) and docker‑compose

Directory layout (simplified)
```
backend/
   app.py                 # Flask app + CORS + blueprint wiring
   routes/                # /api/ai/* and /api/data/* endpoints
   services/              # Data, Gemini, and TTS services
   static/                # Generated charts/audio + uploaded files
frontend/
   src/                   # React app (Assistant, Dashboard, etc.)
   public/sample_datasets # Built‑in demo CSVs
```

## Quick start (local dev)

Prereqs
- Node.js 18+
- Python 3.11+
- A Gemini API key (https://ai.google.dev)

Backend (Flask)
1) In `backend/` create and activate a venv
2) `pip install -r requirements.txt`
3) Copy `.env.example` to `.env` and set `GEMINI_API_KEY`
4) Run `python app.py` (default http://localhost:5000)

Frontend (React)
1) In `frontend/` run `npm install`
2) Start dev server: `npm run dev` (default http://localhost:3000)

Optional: set `VITE_API_URL=http://localhost:5000` in `frontend/.env` if your backend runs on a non‑default host/port.

## Docker
Use `docker-compose up --build` from the repo root. Ensure `backend/.env` contains `GEMINI_API_KEY` before building.

## Using Nova
1) Upload a dataset or click a sample dataset (Sales/Employee/Web Traffic)
2) Browse the Overview, Visualizations, Statistics, Correlations, and Quality tabs
3) Ask questions like:
    - What is the average revenue by region?
    - Show correlation between price and quantity
    - Detect anomalies in sales
4) Use the Assistant to chat (voice or text). Enable TTS for spoken replies.

## API overview

AI
- `POST /api/ai/chat` – conversational responses using Gemini
- `POST /api/ai/process` – single‑shot prompt + optional context
- `POST /api/ai/tts` – generate speech from text
- `GET  /api/ai/status` – model + key status

Data
- `POST /api/data/upload` – upload CSV/XLS/XLSX and trigger profiling
- `POST /api/data/query` – natural‑language analysis over the loaded dataset
- `GET  /api/data/info` – dataset info (shape, columns, types)
- `GET  /api/data/analytics-dashboard` – comprehensive metrics + charts
- `GET  /api/data/quality` – data quality metrics
- `GET  /api/data/summary` – summary stats

## Configuration

Backend (`backend/.env`)
```
GEMINI_API_KEY=your_key
FLASK_DEBUG=False
PORT=5000
CORS_ORIGINS=http://localhost:3000
```

Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

- 500 Chat error after upload: fixed by adding public helpers to `DataService` (get_data_profile, get_column_summaries, suggest_analyses) and reusing a shared `DataService` instance across routes.
- Assistant answer cuts off after “1.”: resolved by removing `"**"` from Gemini `stopSequences` (bold text no longer truncates).
- Sample datasets not loading: frontend now passes the full upload response to the dashboard.
- Duplicate React keys warning: message IDs now use `crypto.randomUUID()` fallback to ensure uniqueness.
- Missing Python libs: ensure the venv is active and `pip install -r backend/requirements.txt` completed (seaborn, scipy, scikit‑learn, etc.).
- CORS: set `CORS_ORIGINS` (comma‑separated) or keep defaults for localhost ports.

## Security notes
- Keep `GEMINI_API_KEY` server‑side (backend `.env`). Do not expose it to the browser.
- Uploaded files are stored under `backend/static/` for processing; clear when not needed.

## License
MIT. See LICENSE if present.

## Acknowledgements
- Google AI (Gemini)
- Flask and React communities
- Tailwind, Plotly, Seaborn, Matplotlib

# 🚀 Nova - Voice-Activated AI Data Assistant

<div align="center">

![Nova Logo](https://img.shields.io/badge/Nova-AI%20Assistant-00ff9f?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjMDBGRjlGIi8+Cjwvc3ZnPgo=)

**A Professional, Resume-Ready Full-Stack AI Application**

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-000000?logo=flask)](https://flask.palletsprojects.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776ab?logo=python)](https://python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285f4?logo=google)](https://ai.google.dev/)

[Live Demo](#) • [Features](#features) • [Setup](#quick-start) • [Documentation](#documentation)

</div>

---

## 🎯 Project Overview

**Nova** is a sophisticated voice-activated AI data assistant that showcases advanced full-stack development skills, AI integration, and data science capabilities. Perfect for demonstrating technical expertise in **Data Science**, **AI/ML**, and **Full-Stack Development** roles.

### 🏆 Why This Project Stands Out

- **🎤 Voice AI Integration** - Real-time speech-to-text and text-to-speech
- **🤖 Gemini AI Powered** - Advanced conversational AI capabilities  
- **📊 Smart Data Analysis** - Natural language queries on CSV/Excel files
- **📈 Automated Visualizations** - Dynamic charts and insights generation
- **🎨 Modern UI/UX** - Dark glassmorphism design with animations
- **🐳 Production Ready** - Dockerized with deployment configurations

---

## ✨ Features

### 🎙️ Voice Interaction
- **Real-time STT** - Browser-based speech recognition
- **Natural TTS** - Multi-language text-to-speech synthesis
- **Voice Commands** - Hands-free data querying and AI conversations
- **Audio Feedback** - Server-side audio generation fallback

### 🧠 AI Intelligence  
- **Conversational AI** - Context-aware chat powered by Gemini AI
- **Smart Data Queries** - Natural language data analysis
- **Automated Insights** - AI-generated explanations of data patterns
- **Query Suggestions** - Intelligent query recommendations

### 📊 Data Analysis Engine
- **File Support** - CSV, Excel (XLSX/XLS) upload and processing
- **Advanced Analytics** - Correlation, trend, distribution analysis
- **Dynamic Visualizations** - Matplotlib, Plotly, Seaborn charts
- **Export Capabilities** - Results export in multiple formats

### 🎨 Modern Frontend
- **Glassmorphism UI** - Dark theme with neon accents
- **Smooth Animations** - Framer Motion powered interactions
- **Responsive Design** - Mobile-first, cross-device compatibility
- **Real-time Updates** - Live data flow and status updates

---

## 🛠️ Tech Stack

### Backend
```
🐍 Python 3.11+        🌶️ Flask 2.3.3         🤖 Gemini AI
📊 Pandas & NumPy      📈 Matplotlib/Plotly   🔊 gTTS & pygame
🗃️ File Processing    🌐 Flask-CORS          📁 Werkzeug Utils
```

### Frontend  
```
⚛️ React 18.2.0        ⚡ Vite 5.0.8          🎨 Tailwind CSS 3.3
🎭 Framer Motion       🎤 Web Speech API       🔊 Web Audio API
🎯 Lucide React        📱 Responsive Design    🌗 Dark Mode First
```

### DevOps & Deployment
```
🐳 Docker & Compose    📦 Multi-stage Builds  🚀 Production Ready
☁️ Render/Heroku       🌐 Vercel/Netlify      📊 Health Checks
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and **Python 3.11+**
- **Gemini AI API Key** ([Get one here](https://ai.google.dev/))

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/nova-ai-assistant.git
cd nova-ai-assistant
```

### 2️⃣ Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Environment configuration
cp .env.example .env
# Add your GEMINI_API_KEY to .env file

# Start backend server
python app.py
```

### 3️⃣ Frontend Setup  
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4️⃣ Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/ai/status

---

## 🐳 Docker Deployment

### One-Command Setup
```bash
# Clone and start with Docker
git clone https://github.com/yourusername/nova-ai-assistant.git
cd nova-ai-assistant

# Add your Gemini API key to backend/.env
echo "GEMINI_API_KEY=your_api_key_here" >> backend/.env

# Start everything
docker-compose up --build
```

### Development Mode
```bash
# Start in development mode with hot reload
docker-compose --profile dev up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 📖 Usage Examples

### 🗣️ Voice Interaction
1. **Click the microphone button** to start voice input
2. **Speak naturally**: *"Hello Nova, tell me about machine learning"*
3. **Get AI response** with optional text-to-speech playback

### 📊 Data Analysis
1. **Upload CSV/Excel file** via the Data tab
2. **Ask questions naturally**:
   - *"What's the average sales by region?"*
   - *"Show me the correlation between price and revenue"*
   - *"Detect any anomalies in customer data"*
3. **Get instant visualizations** with AI explanations

### 🤖 AI Conversation
- **Natural chat**: *"Explain the trends in my data"*
- **Follow-up questions**: *"What does this correlation mean?"*
- **Context awareness**: Previous conversation memory

---

## 🏗️ Project Structure

```
nova-assistant/
├── 📁 backend/
│   ├── 🐍 app.py                 # Flask application entry
│   ├── 📁 routes/
│   │   ├── 🤖 ai.py             # AI & TTS endpoints  
│   │   └── 📊 data.py           # Data analysis endpoints
│   ├── 📁 services/
│   │   ├── 🧠 gemini_service.py # Gemini AI integration
│   │   ├── 📈 data_service.py   # Data processing engine
│   │   └── 🔊 tts_service.py    # Text-to-speech service
│   ├── 📁 static/              # Generated charts & audio
│   ├── 📋 requirements.txt     # Python dependencies
│   └── 🐳 Dockerfile          # Backend container
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 🎤 VoiceButton.jsx      # Voice input component
│   │   │   ├── 💬 AssistantUI.jsx     # Main chat interface
│   │   │   ├── 📊 DataDashboard.jsx   # Data analysis UI
│   │   │   └── 📈 ChatHistory.jsx     # Conversation history
│   │   ├── 📁 hooks/
│   │   │   ├── 🎙️ useSpeechRecognition.js  # Speech-to-text
│   │   │   └── 🔊 useTextToSpeech.js       # Text-to-speech
│   │   └── ⚛️ App.jsx          # Main React component
│   ├── 🎨 tailwind.config.js   # Styling configuration
│   ├── 📦 package.json         # Node dependencies  
│   └── 🐳 Dockerfile          # Frontend container
├── 🐙 docker-compose.yml      # Multi-service orchestration
└── 📖 README.md              # This file
```

---

## 🔧 API Documentation

### AI Endpoints
```http
POST /api/ai/process         # Process text with Gemini AI
POST /api/ai/chat           # Conversational chat with context
POST /api/ai/tts            # Text-to-speech generation
GET  /api/ai/status         # AI services health check
```

### Data Endpoints
```http  
POST /api/data/upload       # Upload & analyze CSV/Excel
POST /api/data/query        # Natural language data queries
GET  /api/data/info         # Current dataset information
POST /api/data/insights     # Automated data insights
GET  /api/data/suggestions  # Query suggestions
```

---

## 🧪 Sample Data & Queries

### Sales Data (CSV)
```csv
Date,Region,Product,Revenue,Quantity
2024-01-01,North,Widget A,1500,50
2024-01-02,South,Widget B,1200,40
2024-01-03,East,Widget A,1800,60
2024-01-04,West,Widget C,2000,70
```

**Try these queries:**
- *"Show spending by age group"*
- *"What's the correlation between age and spending?"*
- *"Compare revenue across regions"*
- *"Show the distribution of customer categories"*

---

## 🔧 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
FLASK_ENV=production
FLASK_DEBUG=False
PORT=5000
CORS_ORIGINS=http://localhost:3000,http://localhost:80
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
NODE_ENV=production
```

---

## 🚀 Deployment Guide

### 🌐 Frontend Deployment (Vercel/Netlify)

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

### ☁️ Backend Deployment (Render/Heroku)

#### Render
1. **Connect GitHub repository**
2. **Select backend folder** as root directory  
3. **Add environment variables** (GEMINI_API_KEY)
4. **Deploy automatically**

---

## 📊 Performance Features

- **Async processing** for large datasets
- **Chart caching** with automatic cleanup
- **Memory management** for data processing
- **Code splitting** with Vite
- **Lazy loading** of components
- **Service worker** for PWA features

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'feat: add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Create Pull Request**

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Google AI](https://ai.google.dev/)** - Gemini AI API
- **[React Team](https://reactjs.org/)** - Amazing frontend framework
- **[Flask](https://flask.palletsprojects.com/)** - Lightweight Python web framework  
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

---

<div align="center">

**🚀 Ready to showcase your full-stack AI skills?**

**Clone, customize, and deploy Nova to stand out in your next interview!**

[![Get Started](https://img.shields.io/badge/Get%20Started-00ff9f?style=for-the-badge&logo=rocket)](#quick-start)

**⭐ Star this repo if it helped you!**

</div>
