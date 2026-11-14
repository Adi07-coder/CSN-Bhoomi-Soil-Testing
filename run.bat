@echo off
setlocal
title "AI Bhoomi - Platform Launcher and 5-Min Continuous Sentinel"

echo ======================================================================
echo            AI BHOOMI - AI-POWERED AGRICULTURE PLATFORM
echo            Launcher and Continuous 5-Min System Sentinel
echo ======================================================================
echo.

set ROOT=%~dp0
cd /d "%ROOT%"

echo [*] Checking Backend REST API on port 8000...
netstat -ano | findstr /R /C:":8000 .*LISTENING" >nul 2>&1
if errorlevel 1 (
    echo [->] Starting Backend Server (Uvicorn FastAPI on Port 8000)...
    start "AI Bhoomi - Backend Server" cmd /k "cd /d \"%ROOT%backend\" && if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) && python run.py"
    echo [OK] Backend server launched in separate window.
    timeout /t 3 /nobreak >nul
) else (
    echo [OK] Backend is already running on port 8000.
)

echo.
echo [*] Checking Frontend Vite Dev Server on port 5173/5174...
netstat -ano | findstr /R /C:":517[34] .*LISTENING" >nul 2>&1
if errorlevel 1 (
    echo [->] Starting Frontend Dev Server (Vite)...
    start "AI Bhoomi - Frontend Client (Vite)" cmd /k "cd /d \"%ROOT%frontend\" && npm run dev"
    echo [OK] Frontend server launched in separate window.
    timeout /t 3 /nobreak >nul
) else (
    echo [OK] Frontend is already running.
)

echo.
echo [->] Starting Continuous 5-Minute Sentinel and Vulnerability Monitor...
start "AI Bhoomi - System Sentinel (5-Min Auto-Audit)" cmd /k "cd /d \"%ROOT%\" && python scripts\system_sentinel.py"
echo [OK] System Sentinel launched. Monitors Backend, DB, Model and Security every 5 mins.

echo.
echo [->] Opening AI Bhoomi Dashboard in your default browser...
timeout /t 2 /nobreak >nul
start http://localhost:5174

echo.
echo ======================================================================
echo    AI BHOOMI PLATFORM IS FULLY OPERATIONAL AND ACTIVELY MONITORED!
echo ======================================================================
echo  - Frontend Dashboard  : http://localhost:5174 (or 5173)
echo  - Backend API Docs    : http://localhost:8000/docs
echo  - System Health API   : http://localhost:8000/api/v1/system/status
echo  - Continuous Sentinel : Auditing Backend, DB, ML Model, and
echo                          Vulnerabilities every 5 minutes (300 sec).
echo                          Status is streamed live directly on the Dashboard!
echo ======================================================================
echo.
echo Keep the server windows open. You may minimize this launcher window.
echo.
pause
