@echo off
title Invoice Finance Platform - Integrated

:MENU
cls
echo ========================================
echo   Invoice Finance Platform - Integrated
echo ========================================
echo.
echo 1. Start Full Platform (Backend + Frontend)
echo 2. Start Backend Only
echo 3. Start Frontend Only
echo 4. Install Dependencies
echo 5. Stop All Services
echo 6. Exit
echo.
set /p choice=Choose an option (1-6): 

if "%choice%"=="1" goto START_FULL
if "%choice%"=="2" goto START_BACKEND
if "%choice%"=="3" goto START_FRONTEND
if "%choice%"=="4" goto INSTALL_DEPS
if "%choice%"=="5" goto STOP_ALL
if "%choice%"=="6" goto EXIT
goto MENU

:START_FULL
echo.
echo 🚀 Starting full platform...
echo.

echo Starting MongoDB...
start "MongoDB" mongod

echo.
echo Starting real-time backend...
cd backend
start "Backend" npm run dev

echo.
echo Starting frontend...
cd ../frontend
copy package-realtime.json package.json
npm install socket.io-client
start "Frontend" npm start

echo.
echo ✅ Full platform started!
echo.
echo 🔗 Backend: http://localhost:5001
echo 🔗 Frontend: http://localhost:3000
echo.
echo 🔐 Demo Credentials:
echo Seller: myseller@test.com / password123
echo Buyer: mybuyer@test.com / password123
echo Investor: myinvestor@test.com / password123
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:START_BACKEND
echo.
echo 🚀 Starting backend only...
cd backend
start "Backend" npm run dev
echo ✅ Backend started on http://localhost:5001
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:START_FRONTEND
echo.
echo 🚀 Starting frontend only...
cd frontend
copy package-realtime.json package.json
npm install socket.io-client
start "Frontend" npm start
echo ✅ Frontend started on http://localhost:3000
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:INSTALL_DEPS
echo.
echo 📦 Installing dependencies...
echo.
echo Installing backend dependencies...
cd backend
npm install

echo.
echo Installing frontend dependencies...
cd ../frontend
copy package-realtime.json package.json
npm install

echo.
echo ✅ All dependencies installed!
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:STOP_ALL
echo.
echo 🛑 Stopping all services...
taskkill /f /im node.exe 2>nul
taskkill /f /im mongod.exe 2>nul
echo ✅ All services stopped!
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:EXIT
echo.
echo 👋 Goodbye!
exit