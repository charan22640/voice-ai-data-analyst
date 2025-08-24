#!/bin/bash

echo "🚀 Setting up Nova AI Assistant for development..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3.11+ is required. Please install Python first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 18+ is required. Please install Node.js first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup backend
echo "📦 Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please add your GEMINI_API_KEY to backend/.env file"
fi

# Create necessary directories
mkdir -p static/{charts,audio,uploads}

cd ..

# Setup frontend
echo "📦 Setting up frontend..."
cd frontend

# Install Node dependencies
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
fi

cd ..

echo "✅ Setup complete!"
echo ""
echo "🚀 To start development:"
echo "   1. Add your GEMINI_API_KEY to backend/.env"
echo "   2. Run: npm run dev (from frontend directory)"
echo "   3. Run: python app.py (from backend directory)"
echo ""
echo "📱 Access the app at: http://localhost:3000"
echo "🔧 Backend API at: http://localhost:5000"
