@echo off
echo === Iniciando LazzSearch ===

start cmd /k "cd server && npm start"
timeout /t 3
start cmd /k "cd client && npm start"

echo.
echo === Serviços iniciados em janelas separadas ===
echo.
pause
