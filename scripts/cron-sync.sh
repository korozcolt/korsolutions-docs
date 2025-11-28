#!/bin/bash

# Script de automatización para sincronización periódica
# Este script sincroniza todos los proyectos desde GitHub

cd "$(dirname "$0")/.."

echo "🚀 Iniciando sincronización automática..."
npm run sync:all

echo "✨ Sincronización completada"
