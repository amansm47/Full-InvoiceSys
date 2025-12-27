@echo off
echo Starting Enhanced Authentication Server...
echo.

echo Checking MongoDB connection...
timeout /t 2 /nobreak > nul

echo Starting server on port 5001...
node test-enhanced-auth.js

pause