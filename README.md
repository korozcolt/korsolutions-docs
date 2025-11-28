# KorSolutions Docs Platform

[![GitHub](https://img.shields.io/badge/GitHub-korozcolt%2Fkorsolutions--docs-blue?logo=github)](https://github.com/korozcolt/korsolutions-docs)
[![Node](https://img.shields.io/badge/Node-%3E%3D20.0-brightgreen?logo=node.js)](https://nodejs.org/)
[![Docusaurus](https://img.shields.io/badge/Docusaurus-3.9.2-green?logo=docusaurus)](https://docusaurus.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?logo=typescript)](https://www.typescriptlang.org/)

Plataforma de documentación centralizada para proyectos de KorSolutions usando Docusaurus.

**🔗 Repositorio:** https://github.com/korozcolt/korsolutions-docs

## 🚀 Características

- ✅ Documentación centralizada de múltiples proyectos
- ✅ Sincronización automática desde GitHub (README, CHANGELOG, commits)
- ✅ Capturas de pantalla automatizadas con Playwright
- ✅ TypeScript + Node 22

## 📦 Proyectos Incluidos

1. **SIGMA** - Sistema Integral de Gestión y Análisis Electoral
2. **Sistema PQRSD** - Gestión de Peticiones, Quejas, Reclamos
3. **ArchiveMaster** - Sistema de Gestión Documental
4. **VolleyPass** - Sistema de Gestión de Torneos de Voleibol

## 📥 Instalación

### Clonar el repositorio

```bash
git clone https://github.com/korozcolt/korsolutions-docs.git
cd korsolutions-docs
```

## ⚙️ Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
GITHUB_TOKEN=tu_token_personal_de_github
```

**Cómo obtener el token:**
1. Ve a GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Selecciona scope: `repo` (para acceso completo a repositorios)
4. Copia el token y guárdalo en `.env`

### 3. Instalar navegador Playwright

```bash
npx playwright install chromium
```

## 🛠️ Comandos Disponibles

### Desarrollo

```bash
npm start              # Inicia servidor de desarrollo en localhost:3000
npm run build          # Genera build de producción
npm run serve          # Sirve el build localmente
```

### Sincronización desde GitHub

```bash
npm run sync sigma          # Sincroniza un proyecto específico
npm run sync pqr            # Sincroniza Sistema PQRSD
npm run sync archivemaster  # Sincroniza ArchiveMaster
npm run sync volleypass     # Sincroniza VolleyPass
npm run sync:all            # Sincroniza todos los proyectos
```

Esto descarga automáticamente:
- README.md → `docs/[proyecto]/github/README.md`
- CHANGELOG.md → `docs/[proyecto]/github/CHANGELOG.md`
- Últimos 10 commits → `docs/[proyecto]/github/COMMITS.json`

:::note
Los archivos README y CHANGELOG sincronizados se guardan en la carpeta `github/` pero **no se importan directamente** en las páginas MDX para evitar problemas de compilación. Las páginas solo enlazan al repositorio de GitHub.
:::

### Capturas de Pantalla

```bash
npm run capture sigma          # Captura screenshots de SIGMA
npm run capture pqr            # Captura screenshots de PQRSD
npm run capture archivemaster  # Captura screenshots de ArchiveMaster
npm run capture volleypass     # Captura screenshots de VolleyPass
```

Las capturas se guardan en: `docs/[proyecto]/screenshots/`

## 🚀 Deployment

### GitHub Pages

Para desplegar automáticamente a GitHub Pages:

1. **Configurar GitHub Pages en el repositorio:**
   - Ve a Settings → Pages
   - Source: GitHub Actions

2. **Crear workflow de despliegue:**

   El proyecto incluye soporte para GitHub Actions. Crea `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches:
         - master
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: "pages"
     cancel-in-progress: false

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: npm
         - name: Install dependencies
           run: npm ci
         - name: Build website
           run: npm run build
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./build

     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

3. **Configurar URL base en `docusaurus.config.ts`:**

   Asegúrate de que la configuración incluya:
   ```typescript
   url: 'https://korozcolt.github.io',
   baseUrl: '/korsolutions-docs/',
   ```

4. **Hacer push y verificar:**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin master
   ```

   El sitio estará disponible en: **https://korozcolt.github.io/korsolutions-docs/**

## 🤖 Automatización

Para automatizar la sincronización periódica con cron:

```bash
# Hacer ejecutable el script
chmod +x scripts/cron-sync.sh

# Editar crontab
crontab -e

# Agregar línea para ejecutar cada 5 horas:
0 */5 * * * /ruta/completa/a/korsolutions-docs/scripts/cron-sync.sh
```

## 📁 Estructura del Proyecto

```
korsolutions-docs/
├── docs/                      # Documentación de proyectos
│   ├── sigma/
│   │   ├── intro.md
│   │   ├── readme.mdx
│   │   ├── changelog.mdx
│   │   ├── screenshots.mdx
│   │   ├── github/            # Sincronizado desde GitHub
│   │   └── screenshots/       # Capturas automáticas
│   ├── pqr/
│   ├── archivemaster/
│   └── volleypass/
├── scripts/                   # Scripts de automatización
│   ├── config/                # Configuración de proyectos
│   ├── syncGithub.ts         # Sincroniza un proyecto
│   ├── syncAll.ts            # Sincroniza todos
│   ├── capture.ts            # Captura screenshots
│   └── cron-sync.sh          # Script para cron
├── types/                     # Tipos TypeScript
├── .env                       # Variables de entorno (NO commitear)
├── package.json
├── tsconfig.json
├── tsconfig.scripts.json
├── docusaurus.config.ts
└── sidebars.ts
```

## 🔧 Tecnologías

- **Docusaurus**: 3.9.2
- **TypeScript**: ~5.6.2
- **Node.js**: >=20.0
- **Octokit**: GitHub API
- **Playwright**: Capturas automáticas
- **tsx**: Ejecución TypeScript

## 📝 Agregar Nuevo Proyecto

1. Crear config en `scripts/config/[proyecto].config.ts`
2. Crear estructura de carpetas en `docs/[proyecto]/`
3. Crear páginas MDX (intro, readme, changelog, screenshots)
4. Actualizar `sidebars.ts`
5. Actualizar `scripts/syncAll.ts` para incluir el nuevo proyecto

## ⚠️ Notas Importantes

- El token de GitHub debe tener scope `repo` completo
- Las credenciales en configs son para capturas automáticas con Playwright
- Los screenshots se nombran según el array `capture` en cada config
- README/CHANGELOG se envuelven en bloques de código para evitar errores MDX

## 🔗 Enlaces Útiles

- **Repositorio:** https://github.com/korozcolt/korsolutions-docs
- **Documentación (en desarrollo):** https://korozcolt.github.io/korsolutions-docs/
- **Issues:** https://github.com/korozcolt/korsolutions-docs/issues
- **Docusaurus:** https://docusaurus.io/

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Proyecto privado - KorSolutions © 2025

**Autor:** [@korozcolt](https://github.com/korozcolt)

