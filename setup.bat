@echo off
echo 🚀 Setting up Nova AI Assistant for development...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python 3.11+ is required. Please install Python first.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 18+ is required. Please install Node.js first.
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Setup backend
echo 📦 Setting up backend...
cd backend

REM Create virtual environment
python -m venv venv
call venv\Scripts\activate

REM Install Python dependencies
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    copy .env.example .env
    echo ⚠️  Please add your GEMINI_API_KEY to backend/.env file
)

REM Create necessary directories
if not exist static\charts mkdir static\charts
if not exist static\audio mkdir static\audio
if not exist static\uploads mkdir static\uploads

cd ..

REM Setup frontend
echo 📦 Setting up frontend...
cd frontend

REM Install Node dependencies
npm install

REM Create .env file if it doesn't exist
if not exist .env (
    copy .env.example .env
)

cd ..

echo ✅ Setup complete!
echo.
echo 🚀 To start development:
echo    1. Add your GEMINI_API_KEY to backend/.env
echo    2. Run: npm run dev (from frontend directory)
echo    3. Run: python app.py (from backend directory)
echo.
echo 📱 Access the app at: http://localhost:3000
echo 🔧 Backend API at: http://localhost:5000

pause
