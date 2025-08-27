# 🚀 Nova - Voice-Activated AI Data Assistant

<div align="center">

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-000000?logo=flask)](https://flask.palletsprojects.com/)
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

## Images
<img width="1746" height="981" alt="Screenshot 2025-08-27 124159" src="https://github.com/user-attachments/assets/5cf14450-74ab-4657-ac04-978c214dfd12" />

<img width="1775" height="977" alt="Screenshot 2025-08-27 124210" src="https://github.com/user-attachments/assets/4e4636c4-4086-44cc-b800-ada7fb469517" />

<img width="1342" height="878" alt="Screenshot 2025-08-27 124240" src="https://github.com/user-attachments/assets/bb210f7c-6098-491f-9511-fccefd2c1bf9" />

<img width="1462" height="917" alt="Screenshot 2025-08-27 124252" src="https://github.com/user-attachments/assets/8a8665a4-0d7e-42cd-9366-d87a6a8508ac" />

<img width="1081" height="936" alt="Screenshot 2025-08-27 124303" src="https://github.com/user-attachments/assets/68d03efe-a37c-4a8d-b405-5e8ff81a6419" />

<img width="1307" height="850" alt="Screenshot 2025-08-27 124315" src="https://github.com/user-attachments/assets/65288ecb-4670-43cb-ab33-c48c29df34a8" />

<img width="1452" height="988" alt="Screenshot 2025-08-27 124330" src="https://github.com/user-attachments/assets/a362d87b-bfbd-4358-8661-4ba1f43593d2" />

<img width="1464" height="975" alt="Screenshot 2025-08-27 124642" src="https://github.com/user-attachments/assets/8563866e-2b40-4b20-95a7-74959abf7a8e" />







### Local Development Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/charan22640/voice-ai-data-analyst.git
   cd voice-ai-data-analyst
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

## ❗ Troubleshooting

- **500 Chat Error**: Fixed by improving DataService with public helpers
- **Message Truncation**: Resolved Gemini stopSequences issue with bold text
- **Sample Data**: Frontend now properly handles upload responses
- **React Keys**: Using crypto.randomUUID() for unique message IDs
- **Missing Libraries**: Ensure venv is active and all deps installed
- **CORS Issues**: Check CORS_ORIGINS matches frontend URL

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
