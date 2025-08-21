@echo off
REM ----------------------------------------
REM Inicia o ngrok na porta 3001 em novo processo
REM ----------------------------------------
start "" "C:\EDNAS\ngrok-v3-stable-windows-amd64\ngrok.exe" http 3001 --log "C:\EDNAS\ngrok.log"

REM Espera alguns segundos para o ngrok levantar e gerar o link
timeout /t 8 /nobreak >nul

REM ----------------------------------------
REM Chama o script updateNgrok.js para buscar o link e atualizar
REM ----------------------------------------
node "C:\EDNAS\app-web-leitura\updateNgrok.js"
