#!/bin/bash

# Comprobar si se está ejecutando dentro de una terminal interactiva
if [ ! -t 0 ] || [ -z "$TERM" ] || [ "$TERM" = "dumb" ]; then
    # Si no, intenta abrir una terminal y ejecutar este mismo script
    if command -v gnome-terminal &> /dev/null; then
        exec gnome-terminal -- bash -c "\"$0\"; read -p 'Presiona Enter para salir...'"
    elif command -v konsole &> /dev/null; then
        exec konsole -e bash -c "\"$0\"; read -p 'Presiona Enter para salir...'"
    elif command -v xfce4-terminal &> /dev/null; then
        exec xfce4-terminal -e "bash -c '\"$0\"; read -p \"Presiona Enter para salir...\"'"
    elif command -v x-terminal-emulator &> /dev/null; then
        exec x-terminal-emulator -e bash -c "\"$0\"; read -p 'Presiona Enter para salir...'"
    else
        # Fallback por si acaso
        xterm -e bash -c "\"$0\"; read -p 'Presiona Enter para salir...'"
        exit 0
    fi
fi

# Cambiar al directorio donde se encuentra este script
cd "$(dirname "$0")" || exit

PORT=3002
# Obtener la IP local de la maquina
IP=$(hostname -I | awk '{print $1}')

clear
echo -e "\e[1;36m==========================================================\e[0m"
echo -e "\e[1;32m   Iniciando servicio Sinnoh Dex...\e[0m"
echo -e "\e[1;32m   La aplicacion estara disponible en tu red en:\e[0m"
echo -e "\n   \e[1;34mhttp://$IP:$PORT\e[0m\n"
echo -e "\e[1;36m==========================================================\e[0m"
echo ""

# Levantar el servicio
npm run dev -- --host 0.0.0.0 --port $PORT
