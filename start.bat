@echo off
echo ========================================
echo  Invoice Financing Platform - Startup
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Application...
start "Frontend App" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo  Both servers are starting...
echo  Backend: http://localhost:5005
echo  Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit this window...
pause > nul
