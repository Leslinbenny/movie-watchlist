@echo off
title CineTrack Watchlist - Master Launcher
echo ========================================================
echo   Starting CineTrack: Movie & TV Watchlist Application
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Django REST Backend on http://127.0.0.1:8000/ ...
start "CineTrack Backend (Django)" cmd /k "cd /d %~dp0backend && ..\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"

echo [2/3] Starting React Frontend on http://localhost:5173/ ...
start "CineTrack Frontend (React)" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173/ ...
start http://localhost:5173/

echo.
echo ========================================================
echo   CineTrack is now RUNNING!
echo   - Frontend: http://localhost:5173/
echo   - Backend:  http://127.0.0.1:8000/api/
echo   - Demo Account: demo / password123
echo ========================================================
echo.
echo You can close this window now. Keep the Backend and Frontend windows open!
pause
