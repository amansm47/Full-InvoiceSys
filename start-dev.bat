@echo off
title Invoice Finance Platform - Dev Environment

:MENU
cls
echo ========================================
echo   Invoice Finance Platform - Dev Menu
echo ========================================
echo.
echo 1. Full Setup (Install + Start All)
echo 2. Quick Start (Start All Services)
echo 3. Start Real-time Backend Only
echo 4. Restart Backend Only
echo 5. Restart Frontend Only
echo 6. Stop All Services
echo 7. Exit
echo.
set /p choice=Choose an option (1-7): 

if "%choice%"=="1" goto FULL_SETUP
if "%choice%"=="2" goto QUICK_START
if "%choice%"=="3" goto REALTIME_BACKEND
if "%choice%"=="4" goto RESTART_BACKEND
if "%choice%"=="5" goto RESTART_FRONTEND
if "%choice%"=="6" goto STOP_ALL
if "%choice%"=="7" goto EXIT
goto MENU

:FULL_SETUP
echo.
echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Error installing backend dependencies!
    pause
    goto MENU
)

echo.
echo Installing frontend dependencies...
cd ../frontend
call npm install
if errorlevel 1 (
    echo Error installing frontend dependencies!
    pause
    goto MENU
)

cd ..
goto START_SERVICES

:QUICK_START
:START_SERVICES
echo.
echo Starting MongoDB...
start "MongoDB" mongod

echo.
echo Starting backend server...
cd backend
start "Real-time Backend" npm run dev

echo.
echo Starting frontend development server...
cd ../frontend
start "Frontend" npm start

echo.
echo All services started!
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo MongoDB: Running locally
echo.
echo 📊 Demo Login Credentials:
echo Seller: seller@demo.com / password123
echo Buyer: buyer@demo.com / password123
echo Investor: investor@demo.com / password123
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:REALTIME_BACKEND
echo.
echo 🚀 Starting real-time backend only...
cd backend
start "Real-time Backend" npm run dev
echo.
echo Real-time backend started!
echo Backend: http://localhost:5001
echo Health Check: http://localhost:5001/api/health
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:RESTART_BACKEND
echo.
echo Stopping backend processes...
taskkill /f /im node.exe /fi "WINDOWTITLE eq Backend*" 2>nul
timeout /t 2 /nobreak >nul

echo Starting backend server...
cd backend
start "Backend" npm run dev

echo Backend restarted!
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:RESTART_FRONTEND
echo.
echo Stopping frontend processes...
taskkill /f /im node.exe /fi "WINDOWTITLE eq Frontend*" 2>nul
timeout /t 2 /nobreak >nul

echo Starting frontend development server...
cd frontend
start "Frontend" npm start

echo Frontend restarted!
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:STOP_ALL
echo.
echo Stopping all services...
taskkill /f /im node.exe 2>nul
taskkill /f /im mongod.exe 2>nul
echo All services stopped!
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:EXIT
echo.
echo Goodbye!
exit