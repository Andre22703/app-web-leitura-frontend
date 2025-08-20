@echo off
REM Inicia a API
start "" node "C:\EDNAS\app-web-leitura\backend\server.js"

REM Espera 5 segundos para a API subir
timeout /t 5 /nobreak >nul

REM Inicia o ngrok na porta 3001
start "" "C:\EDNAS\ngrok-v3-stable-windows-amd64\ngrok.exe" http 3001

REM Espera 8 segundos para o ngrok gerar o link
timeout /t 8 /nobreak >nul

REM Executa o script PowerShell que atualiza a variável no Vercel
powershell -ExecutionPolicy Bypass -File "C:\EDNAS\app-web-leitura\ngrok-vercel.ps1"
