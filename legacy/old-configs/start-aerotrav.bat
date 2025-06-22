@echo off
title AeroTrav - Full Stack Travel Application
color 0A

echo =====================================
echo    AeroTrav - Travel Made Easier
echo =====================================
echo.

REM Kill any existing Node.js processes
echo 🔄 Stopping any existing servers...
taskkill /F /IM node.exe >nul 2>&1
echo ✅ Cleared existing processes
echo.

REM Check if npm dependencies are installed
echo 📦 Checking dependencies...
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)
if not exist "server/node_modules" (
    echo Installing backend dependencies...
    cd server
    npm install
    cd ..
)
echo ✅ Dependencies ready
echo.

REM Start Backend Server
echo 🚀 Starting Backend Server (Port 3001)...
cd server
start /MIN node index.js
cd ..
timeout /T 3 /NOBREAK >nul
echo ✅ Backend server started
echo.

REM Start Frontend Server
echo 🌟 Starting Frontend Server (Port 5173)...
start /MIN npm run dev
timeout /T 5 /NOBREAK >nul
echo ✅ Frontend server started
echo.

REM Wait for servers to be ready
echo ⏳ Waiting for servers to initialize...
timeout /T 8 /NOBREAK >nul

REM Check if servers are running
echo 🔍 Verifying server status...
netstat -ano | findstr :3001 >nul
if errorlevel 1 (
    echo ❌ Backend server failed to start
    pause
    exit /b 1
) else (
    echo ✅ Backend running on port 3001
)

netstat -ano | findstr :5173 >nul
if errorlevel 1 (
    echo ❌ Frontend server failed to start
    pause
    exit /b 1
) else (
    echo ✅ Frontend running on port 5173
)

echo.
echo =====================================
echo        🎉 AeroTrav is Ready! 🎉
echo =====================================
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3001/health
echo.
echo ✈️  Flight Search: MySQL Database
echo 📊 Status: All systems operational
echo.
echo Press any key to open the application...
pause >nul

start http://localhost:5173

echo.
echo 💡 Tip: Keep this window open while using AeroTrav
echo    Close this window to stop all servers
echo.
echo Press any key to exit and stop servers...
pause >nul

REM Clean shutdown
echo.
echo 🔄 Stopping servers...
taskkill /F /IM node.exe >nul 2>&1
echo ✅ All servers stopped
echo 👋 Thank you for using AeroTrav!
timeout /T 2 /NOBREAK >nul 