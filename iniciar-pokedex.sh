#!/bin/bash

echo "========================================="
echo "     Iniciando Pokedex de Sinnoh..."
echo "========================================="
echo ""

# 1. Comprueba si Node.js esta instalado
if ! command -v node &> /dev/null; then
    echo "[ATENCION] Node.js no esta instalado en este ordenador."
    echo "[INFO] Intentando instalar Node.js automaticamente..."
    
    if command -v apt-get &> /dev/null; then
        echo "[INFO] Detectado sistema basado en Debian/Ubuntu (usando apt)..."
        sudo apt-get update
        sudo apt-get install -y nodejs npm
    elif command -v dnf &> /dev/null; then
        echo "[INFO] Detectado sistema basado en Fedora/RHEL (usando dnf)..."
        sudo dnf install -y nodejs npm
    elif command -v pacman &> /dev/null; then
        echo "[INFO] Detectado sistema basado en Arch Linux (usando pacman)..."
        sudo pacman -S --noconfirm nodejs npm
    else
        echo "[ERROR] No se pudo instalar Node.js automaticamente en esta distribucion de Linux."
        echo "Por favor, instala Node.js (y npm) de forma manual y vuelve a ejecutar este script."
        exit 1
    fi
    
    echo ""
    echo "[EXITO] Node.js se ha instalado correctamente."
    echo ""
fi

# 2. Comprueba si las dependencias estan instaladas
if [ ! -d "node_modules" ]; then
    echo "[INFO] Instalando dependencias por primera vez..."
    echo "[INFO] Esto puede tardar unos minutos..."
    npm install
    echo ""
fi

echo "[INFO] Arrancando el servidor..."
echo "[INFO] Se abrira una pestana en tu navegador automaticamente."
echo ""

# 3. Ejecuta Vite en el puerto 3002 y abre el navegador por defecto
npm run dev -- --port 3002 --open
