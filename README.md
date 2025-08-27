# 🚀 Nova - Voice-Activated AI Data Assistant

<div align="center">

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)](https://reactjs.org/)
[![Flask](https://img.shie## ❗ Troubleshooting

- **500 Chat Error**: Fixed by improving DataService with public helpers
- **Message Truncation**: Resolved Gemini stopSequences issue with bold text
- **Sample Data**: Frontend now properly handles upload responses
- **React Keys**: Using crypto.randomUUID() for unique message IDs
- **Missing Libraries**: Ensure venv is active and all deps installed
- **CORS Issues**: Check CORS_ORIGINS matches frontend URLadge/Flask-2.3.3-000000?logo=flask)](https://flask.palletsprojects.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776ab?logo=python)](https://python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285f4?logo=google)](https://ai.google.dev/)

[Features](#-features) • [Quick Start](#-quick-start) • [Usage](#-usage-guide) • [API Docs](#-api-documentation)

</div>

---

## 🎯 Project Overview

Nova is a sophisticated voice-activated AI data assistant that combines advanced full-stack development with AI and data science capabilities. Upload datasets, ask questions naturally through voice or text, and receive AI-powered insights with visualizations.

### Key Highlights

- 🎤 **Voice Interaction**: Real-time speech recognition and text-to-speech
- 🧠 **AI-Powered**: Smart conversations and data analysis using Gemini AI
- 📊 **Data Analysis**: Process CSV/Excel files with automated insights
- 🎨 **Modern UI**: Dark-themed glassmorphism design with smooth animations
- 🐳 **Production Ready**: Fully dockerized with deployment configurations

## ✨ Features

### Voice & Chat Interface
- **Voice Commands**: Natural speech recognition for hands-free interaction
- **Text-to-Speech**: AI responses with high-quality voice synthesis
- **Smart Context**: Maintains conversation history and dataset awareness
- **Real-time Status**: Visual feedback for voice, TTS, and AI states

### Data Analysis
- **File Support**: Upload and analyze CSV, Excel (XLSX/XLS) files
- **Automated Analysis**: 
  - Statistical summaries and insights
  - Correlation analysis
  - Distribution plots
  - Trend detection
  - Anomaly identification
- **Natural Queries**: Ask questions in plain English about your data
- **Dynamic Visualizations**: Auto-generated charts and graphs

### AI Intelligence
- **Context-Aware**: Remembers conversation history and dataset details
- **Smart Responses**: Detailed explanations of data patterns
- **Query Suggestions**: Intelligent recommendations for data exploration
- **Error Handling**: Graceful fallbacks and helpful error messages

### Modern UI/UX
- **Responsive Design**: Mobile-first approach, works on all devices
- **Dark Theme**: Easy on the eyes with neon accents
- **Smooth Animations**: Framer Motion transitions and feedback
- **Accessibility**: Voice control and keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- [Gemini API Key](https://ai.google.dev/)

### Local Development Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/nova-ai-assistant.git
   cd nova-ai-assistant
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\\Scripts\\activate
   pip install -r requirements.txt
   ```
   Create `backend/.env`:
   ```
   GEMINI_API_KEY=your_key_here
   FLASK_DEBUG=True
   PORT=5000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```
   Create `frontend/.env` if needed:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. **Run Development Servers**
   ```bash
   # Terminal 1 (Backend)
   cd backend
   python app.py

   # Terminal 2 (Frontend)
   cd frontend
   npm run dev
   ```

### Docker Setup
```bash
# Add API key to backend/.env first
echo "GEMINI_API_KEY=your_key_here" > backend/.env

# Build and run
docker-compose up --build
```

## 📖 Usage Guide

### Voice Interaction
1. Click the microphone button or press Space to start voice input
2. Speak naturally (e.g., "Analyze the sales trends")
3. Get AI responses with optional voice playback

### Data Analysis
1. Upload CSV/Excel or select a sample dataset
2. Ask questions like:
   - "What's the average revenue by region?"
   - "Show correlations between price and quantity"
   - "Are there any outliers in the sales data?"
3. Explore auto-generated visualizations and insights

### Chat Features
- **Context-Aware**: References previous conversations
- **Data-Aware**: Understands current dataset details
- **Multi-Modal**: Switch between voice and text seamlessly
- **Rich Responses**: Text, charts, and voice synthesis

## 🏗️ Project Structure

```
nova-assistant/
├── backend/
│   ├── app.py              # Flask application entry
│   ├── routes/
│   │   ├── ai.py          # AI & TTS endpoints
│   │   └── data.py        # Data analysis endpoints
│   ├── services/
│   │   ├── gemini_service.py
│   │   ├── data_service.py
│   │   └── tts_service.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom React hooks
│   │   └── App.jsx
│   └── package.json
└── docker-compose.yml
```

## 🔧 API Documentation

### AI Endpoints
```http
POST /api/ai/chat           # Conversational AI with context
POST /api/ai/tts           # Text-to-speech generation
GET  /api/ai/status        # Service health check
```

### Data Endpoints
```http
POST /api/data/upload      # Upload & analyze data files
POST /api/data/query       # Natural language queries
GET  /api/data/info        # Dataset information
GET  /api/data/insights    # Automated insights
```

## ⚙️ Configuration 

### Backend (.env)
```env
GEMINI_API_KEY=your_key_here  # Required: Get from Google AI
FLASK_DEBUG=False             # Set True for development
PORT=5000                     # API server port
CORS_ORIGINS=http://localhost:3000  # Frontend URL(s)
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000  # Backend API URL
```

## Troubleshooting

- 500 Chat error after upload: fixed by adding public helpers to `DataService` (get_data_profile, get_column_summaries, suggest_analyses) and reusing a shared `DataService` instance across routes.
- Assistant answer cuts off after “1.”: resolved by removing `"**"` from Gemini `stopSequences` (bold text no longer truncates).
- Sample datasets not loading: frontend now passes the full upload response to the dashboard.
- Duplicate React keys warning: message IDs now use `crypto.randomUUID()` fallback to ensure uniqueness.
- Missing Python libs: ensure the venv is active and `pip install -r backend/requirements.txt` completed (seaborn, scipy, scikit‑learn, etc.).
- CORS: set `CORS_ORIGINS` (comma‑separated) or keep defaults for localhost ports.

## 🔒 Security Notes

- Keep GEMINI_API_KEY on backend only - never expose to browser
- Clean up uploaded files from backend/static/ when not needed
- Use HTTPS in production for secure data transmission

## 🙌 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google AI](https://ai.google.dev/) - Gemini AI API
- [React](https://reactjs.org/) - Frontend framework  
- [Flask](https://flask.palletsprojects.com/) - Backend framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

</div>



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
