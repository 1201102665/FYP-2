@echo off
echo Starting AeroTrav Full Stack Application...
echo.

REM Kill any existing processes
echo Stopping any existing servers...
taskkill /F /IM node.exe 2>nul
echo.

REM Start backend server
echo Starting Backend Server (Port 3001)...
cd server
start /B node index.js
cd ..
echo Backend server started!
echo.

REM Wait a moment for backend to start
timeout /T 3 /NOBREAK >nul

REM Start frontend server
echo Starting Frontend Server (Port 5173)...
start /B npm run dev
echo Frontend server started!
echo.

echo ✅ Both servers are starting up...
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3001
echo.
echo Press any key to open the application in your browser...
pause >nul

start http://localhost:5173 