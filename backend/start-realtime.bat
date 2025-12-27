@echo off
title Real-time Invoice Finance Backend

:MENU
cls
echo ========================================
echo   Real-time Invoice Finance Backend
echo ========================================
echo.
echo 1. First Time Setup (Install + Seed + Start)
echo 2. Start Development Server
echo 3. Seed Database Only
echo 4. Clear Database
echo 5. Install Dependencies
echo 6. Run Tests
echo 7. Exit
echo.
set /p choice=Choose an option (1-7): 

if "%choice%"=="1" goto FIRST_SETUP
if "%choice%"=="2" goto START_DEV
if "%choice%"=="3" goto SEED_ONLY
if "%choice%"=="4" goto CLEAR_DB
if "%choice%"=="5" goto INSTALL_DEPS
if "%choice%"=="6" goto RUN_TESTS
if "%choice%"=="7" goto EXIT
goto MENU

:FIRST_SETUP
echo.
echo 🚀 Setting up real-time backend for the first time...
echo.
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies!
    pause
    goto MENU
)

echo.
echo 🌱 Seeding database with demo data...
call npm run seed
if errorlevel 1 (
    echo ❌ Failed to seed database!
    pause
    goto MENU
)

echo.
echo ✅ Setup complete! Starting development server...
echo.
echo 📊 Demo Login Credentials:
echo Seller: seller@demo.com / password123
echo Buyer: buyer@demo.com / password123
echo Investor: investor@demo.com / password123
echo.
echo 🔗 Server will start on: http://localhost:5001
echo 🔗 Frontend should connect to: http://localhost:3000
echo.
pause
call npm run dev
goto MENU

:START_DEV
echo.
echo 🚀 Starting real-time development server...
echo.
echo 📊 Demo Login Credentials:
echo Seller: seller@demo.com / password123
echo Buyer: buyer@demo.com / password123
echo Investor: investor@demo.com / password123
echo.
echo 🔗 Server: http://localhost:5001
echo 🔗 Health Check: http://localhost:5001/api/health
echo.
call npm run dev
goto MENU

:SEED_ONLY
echo.
echo 🌱 Seeding database with demo data...
call npm run seed
if errorlevel 1 (
    echo ❌ Failed to seed database!
) else (
    echo ✅ Database seeded successfully!
    echo.
    echo 📊 Demo Login Credentials:
    echo Seller: seller@demo.com / password123
    echo Buyer: buyer@demo.com / password123
    echo Investor: investor@demo.com / password123
)
echo.
pause
goto MENU

:CLEAR_DB
echo.
echo 🗑️ Clearing database...
call npm run clear
if errorlevel 1 (
    echo ❌ Failed to clear database!
) else (
    echo ✅ Database cleared successfully!
)
echo.
pause
goto MENU

:INSTALL_DEPS
echo.
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies!
) else (
    echo ✅ Dependencies installed successfully!
)
echo.
pause
goto MENU

:RUN_TESTS
echo.
echo 🧪 Running tests...
call npm test
echo.
pause
goto MENU

:EXIT
echo.
echo 👋 Goodbye!
exit