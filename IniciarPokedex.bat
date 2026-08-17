@echo off
title Pokedex Sinnoh
echo =========================================
echo      Iniciando Pokedex de Sinnoh...
echo =========================================
echo.

:: 1. Comprueba si Node.js esta instalado
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ATENCION] Node.js no esta instalado en este ordenador.
    echo [INFO] Para poder iniciar la Pokedex, necesitas instalar Node.js.
    echo [INFO] Abriendo la pagina oficial de descarga en tu navegador...
    echo.
    start https://nodejs.org/
    echo [PASOS A SEGUIR]
    echo 1. Descarga la version "LTS" -Recomendada-.
    echo 2. Instalala dejando todo por defecto -pulsa Siguiente a todo-.
    echo 3. Cuando termine de instalarse, CIERRA ESTA VENTANA NEGRA.
    echo 4. Vuelve a abrir IniciarPokedex.bat y todo funcionara.
    echo.
    pause
    exit
)

:: 2. Comprueba si las dependencias estan instaladas
IF NOT EXIST node_modules (
    echo [INFO] Instalando dependencias por primera vez...
    echo [INFO] Esto puede tardar unos minutos...
    call npm install
    echo.
)

echo [INFO] Arrancando el servidor...
echo [INFO] Se abrira una pestana en tu navegador automaticamente.
echo.

:: 3. Ejecuta Vite en el puerto 3002, lo expone en red local y abre el navegador por defecto
call npm run dev -- --host --port 3002 --open

pause
