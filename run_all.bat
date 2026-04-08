@echo off
setlocal

rem ------------------------------------------------------------
rem  Easy one‑click starter for STACKR (Windows)
rem  - Starts Docker containers (Postgres + Redis)
rem  - Installs backend & frontend deps if missing
rem  - Launches backend (node src/server.js) in its own console
rem  - Launches frontend (npm run dev) in its own console
rem ------------------------------------------------------------

rem ---- 1️⃣ Docker services ------------------------------------------------
echo Starting Docker containers (Postgres & Redis)...
docker-compose up -d

rem ---- 2️⃣ Backend -------------------------------------------------------
pushd backend
if not exist node_modules (
  echo Installing backend dependencies...
  npm install
) else (
  echo Backend dependencies already installed.
)
rem Launch backend in a new console window
start "STACKR Backend" cmd /k "node src/server.js"
popd

rem ---- 3️⃣ Frontend ------------------------------------------------------
pushd frontend
if not exist node_modules (
  echo Installing frontend dependencies...
  npm install
) else (
  echo Frontend dependencies already installed.
)
rem Launch Next.js dev server in a new console window
start "STACKR Frontend" cmd /k "npm run dev"
popd

echo.
echo ------------------------------------------------------------
echo All services are up! Open your browser at:
echo   http://localhost:3000
echo ------------------------------------------------------------
endlocal
