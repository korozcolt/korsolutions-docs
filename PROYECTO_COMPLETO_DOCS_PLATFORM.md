# 📚 DOCUMENTACIÓN COMPLETA - DOCS PLATFORM - KORSOLUTIONS DOCS
## Para reconstruir el proyecto desde cero

---

## 🎯 OBJETIVO DEL PROYECTO

Crear una plataforma de documentación centralizada usando **Docusaurus** que:

1. ✅ Muestre documentación de múltiples proyectos en un solo sitio
2. ✅ Sincronice automáticamente README y CHANGELOG desde GitHub
3. ✅ Capture screenshots automáticos de cada proyecto
4. ✅ Se pueda automatizar con cron para actualización periódica

---

## 📋 REQUISITOS TÉCNICOS

- **Node.js:** v22.x (la más actual)
- **Package Manager:** npm
- **TypeScript:** Sí (para detectar errores antes de compilar)
- **Framework:** Docusaurus 3.9.2

---

## 🗂 PROYECTOS CONFIGURADOS

### 1. SIGMA - Sistema Integral de Gestión y Análisis Electoral

```typescript
{
  name: 'sigma',
  repoOwner: 'korozcolt',
  repoName: 'sigma-project',
  documentationPath: 'docs/sigma',
  baseUrl: 'https://sigma-project.test',
  loginUrl: '/admin/login',
  credentials: {
    email: 'ing.korozco@gmail.com',
    password: 'Admin123'
  },
  capture: [
    { route: '/admin', name: 'dashboard' },
    { route: '/admin/voters', name: 'voters-list' },
    { route: '/admin/voters/create', name: 'voters-create' },
    { route: '/admin/campaigns', name: 'campaigns-list' }
  ]
}
```

**GitHub:** https://github.com/korozcolt/sigma-project

---

### 2. Sistema PQRSD - Gestión de Peticiones, Quejas, Reclamos

```typescript
{
  name: 'pqr',
  repoOwner: 'korozcolt',
  repoName: 'sistema-pqrsd',
  documentationPath: 'docs/pqr',
  baseUrl: 'https://sistema-pqrsd.test',
  loginUrl: '/admin/login',
  credentials: {
    email: 'ing.korozco@gmail.com',
    password: 'Admin123'
  },
  capture: [
    { route: '/admin', name: 'dashboard' },
    { route: '/admin/tickets', name: 'tickets-list' },
    { route: '/admin/tickets/create', name: 'tickets-create' },
    { route: '/admin/users', name: 'users-list' }
  ]
}
```

**GitHub:** https://github.com/korozcolt/sistema-pqrsd

---

### 3. ArchiveMaster - Sistema de Gestión Documental

```typescript
{
  name: 'archivemaster',
  repoOwner: 'korozcolt',
  repoName: 'archive-master-app',
  documentationPath: 'docs/archivemaster',
  baseUrl: 'https://archive-master-app.test',
  loginUrl: '/admin/login',
  credentials: {
    email: 'ing.korozco@gmail.com',
    password: 'Q@10op29+'
  },
  capture: [
    { route: '/admin', name: 'dashboard' },
    { route: '/admin/files', name: 'files-list' },
    { route: '/admin/offices', name: 'offices' }
  ]
}
```

**GitHub:** https://github.com/korozcolt/archive-master-app

---

### 4. VolleyPass - Sistema de Gestión de Torneos de Voleibol

```typescript
{
  name: 'volleypass',
  repoOwner: 'korozcolt',
  repoName: 'volleypass-new',
  documentationPath: 'docs/volleypass',
  baseUrl: 'https://volleypass-new.test',
  loginUrl: '/admin/login',
  credentials: {
    email: 'ing.korozco+admin@gmail.com',
    password: 'Admin123'
  },
  capture: [
    { route: '/admin', name: 'dashboard' },
    { route: '/admin/players', name: 'players-list' },
    { route: '/admin/players/create', name: 'players-create' },
    { route: '/admin/tournaments', name: 'tournaments-list' }
  ]
}
```

**GitHub:** https://github.com/korozcolt/volleypass-new

---

## 🔧 CONFIGURACIÓN INICIAL

### 1. Crear proyecto Docusaurus

```bash
npx create-docusaurus@latest docs-platform classic --typescript
cd docs-platform
```

### 2. Instalar dependencias adicionales

```bash
npm install octokit dotenv playwright
npm install --save-dev @types/node tsx
```

### 3. Variables de entorno (.env)

```env
GITHUB_TOKEN=tu_token_personal_de_github
```

**Cómo obtener el token:**
1. Ve a GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Selecciona scope: `repo` (para acceso completo a repositorios)
4. Copia el token y guárdalo en `.env`

---

## 📁 ESTRUCTURA DEL PROYECTO

```
docs-platform/
├── .env                          # Token de GitHub (NO commitear)
├── package.json
├── tsconfig.json
├── tsconfig.scripts.json         # Config para scripts TypeScript
├── docusaurus.config.ts
├── sidebars.ts
│
├── docs/                         # Documentación de proyectos
│   ├── sigma/
│   │   ├── intro.md
│   │   ├── readme.mdx
│   │   ├── changelog.mdx
│   │   ├── screenshots.mdx
│   │   ├── github/               # Sincronizado desde GitHub
│   │   │   ├── README.mdx
│   │   │   ├── CHANGELOG.mdx
│   │   │   └── COMMITS.json
│   │   └── screenshots/          # Capturas automáticas
│   │       ├── dashboard.png
│   │       └── voters-list.png
│   ├── pqr/
│   ├── archivemaster/
│   └── volleypass/
│
├── scripts/                      # Scripts de automatización
│   ├── syncGithub.ts            # Sincroniza README, CHANGELOG, commits
│   ├── syncAll.ts               # Sincroniza todos los proyectos
│   ├── capture.ts               # Captura screenshots con Playwright
│   └── config/
│       ├── sigma.config.ts
│       ├── pqr.config.ts
│       ├── archivemaster.config.ts
│       └── volleypass.config.ts
│
├── types/
│   └── project-config.ts        # Tipos TypeScript
│
└── src/
    ├── components/
    ├── pages/
    └── css/
```

---

## 🔨 TIPOS TYPESCRIPT

**`types/project-config.ts`:**

```typescript
export interface GithubProjectConfig {
  name: string;
  repoOwner: string;
  repoName: string;
  documentationPath: string;
  baseUrl: string;
  loginUrl: string;
  credentials: {
    email: string;
    password: string;
  };
  capture: Array<{
    route: string;
    name: string;
  }>;
}
```

---

## ⚙️ CONFIGURACIÓN TYPESCRIPT

**`tsconfig.scripts.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "types": ["node"]
  },
  "include": ["scripts/**/*", "types/**/*"]
}
```

---

## 📦 PACKAGE.JSON - Scripts

```json
{
  "scripts": {
    "start": "docusaurus start",
    "build": "docusaurus build",
    "sync": "tsx scripts/syncGithub.ts",
    "sync:all": "tsx scripts/syncAll.ts",
    "capture": "tsx scripts/capture.ts"
  }
}
```

---

## 🗃 SIDEBAR CONFIGURATION

**`sidebars.ts`:**

```typescript
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'SIGMA',
      link: { type: 'doc', id: 'sigma/intro' },
      items: [
        'sigma/readme',
        'sigma/changelog',
        'sigma/screenshots'
      ]
    },
    {
      type: 'category',
      label: 'Sistema PQRSD',
      link: { type: 'doc', id: 'pqr/intro' },
      items: [
        'pqr/readme',
        'pqr/changelog',
        'pqr/screenshots'
      ]
    },
    {
      type: 'category',
      label: 'ArchiveMaster',
      link: { type: 'doc', id: 'archivemaster/intro' },
      items: [
        'archivemaster/readme',
        'archivemaster/changelog',
        'archivemaster/screenshots'
      ]
    },
    {
      type: 'category',
      label: 'VolleyPass',
      link: { type: 'doc', id: 'volleypass/intro' },
      items: [
        'volleypass/readme',
        'volleypass/changelog',
        'volleypass/screenshots'
      ]
    }
  ]
};

export default sidebars;
```

---

## 🚀 COMANDOS DE USO

### Desarrollo

```bash
npm start                 # Inicia servidor en localhost:3000
```

### Sincronización desde GitHub

```bash
npm run sync sigma        # Sincroniza un proyecto
npm run sync:all          # Sincroniza todos los proyectos
```

Esto descarga:
- README.md → docs/[proyecto]/github/README.mdx
- CHANGELOG.md → docs/[proyecto]/github/CHANGELOG.mdx
- Últimos 10 commits → docs/[proyecto]/github/COMMITS.json

### Capturas de pantalla

```bash
npm run capture sigma     # Captura screenshots de sigma
```

Guarda en: `docs/sigma/screenshots/[name].png`

### Build de producción

```bash
npm run build            # Genera build en /build
npm run serve            # Sirve el build localmente
```

---

## 🤖 AUTOMATIZACIÓN CON CRON

**Script de automatización (`scripts/cron-sync.sh`):**

```bash
#!/bin/bash
cd /ruta/a/docs-platform
npm run sync:all
```

**Configurar cron:**

```bash
chmod +x scripts/cron-sync.sh

# Editar crontab
crontab -e

# Agregar línea (cada 5 horas):
0 */5 * * * /ruta/a/docs-platform/scripts/cron-sync.sh
```

---

## 📝 PÁGINAS MDX PARA CADA PROYECTO

### `docs/sigma/readme.mdx`

```mdx
---
sidebar_position: 2
title: README del Proyecto
---

import ReadmeContent from './github/README.mdx';

# 📄 README del Proyecto

<ReadmeContent />

:::info Sincronización
Ejecuta `npm run sync sigma` para actualizar
:::
```

### `docs/sigma/changelog.mdx`

```mdx
---
sidebar_position: 3
title: What's New
---

import ChangelogContent from './github/CHANGELOG.mdx';

# 🆕 What's New

<ChangelogContent />
```

### `docs/sigma/screenshots.mdx`

```mdx
---
sidebar_position: 4
title: Capturas de Pantalla
---

# 📸 Capturas

![Dashboard](./screenshots/dashboard.png)
![Votantes](./screenshots/voters-list.png)

:::info Actualizar
`npm run capture sigma`
:::
```

---

## ⚠️ ERRORES COMUNES A EVITAR

### ❌ NO usar `"type": "module"` en package.json
- Causa conflictos con Docusaurus
- Docusaurus genera archivos CommonJS internamente

### ❌ NO usar archivos `.mts` o `.cts`
- Usar solo `.ts` con `tsx` para ejecución
- `tsx` maneja ESM/CJS automáticamente

### ❌ NO instalar dependencias con diferentes versiones de Node
- Siempre usar Node 22 consistentemente
- Si cambias de versión, reinstala: `rm -rf node_modules && npm install`

### ✅ SÍ usar `tsx` en lugar de `ts-node`
- `tsx` soporta top-level await nativamente
- No necesita configuración especial para ESM

---

## 🎯 PASOS PARA RECONSTRUIR DESDE CERO

### 1. Inicializar proyecto

```bash
npx create-docusaurus@latest docs-platform classic --typescript
cd docs-platform
```

### 2. Instalar dependencias

```bash
npm install octokit dotenv playwright
npm install --save-dev @types/node tsx
```

### 3. Crear estructura de carpetas

```bash
mkdir -p types
mkdir -p scripts/config
mkdir -p docs/{sigma,pqr,archivemaster,volleypass}/github
mkdir -p docs/{sigma,pqr,archivemaster,volleypass}/screenshots
```

### 4. Crear archivos de configuración

- `types/project-config.ts`
- `scripts/config/sigma.config.ts`
- `scripts/config/pqr.config.ts`
- `scripts/config/archivemaster.config.ts`
- `scripts/config/volleypass.config.ts`
- `tsconfig.scripts.json`

### 5. Crear scripts de sincronización

- `scripts/syncGithub.ts`
- `scripts/syncAll.ts`
- `scripts/capture.ts`

### 6. Configurar .env

```env
GITHUB_TOKEN=tu_token_aqui
```

### 7. Actualizar package.json scripts

```json
"sync": "tsx scripts/syncGithub.ts",
"sync:all": "tsx scripts/syncAll.ts",
"capture": "tsx scripts/capture.ts"
```

### 8. Crear páginas MDX para cada proyecto

- `intro.md`
- `readme.mdx`
- `changelog.mdx`
- `screenshots.mdx`

### 9. Actualizar sidebars.ts

### 10. Probar

```bash
npm run sync:all
npm start
```

---

## 📌 NOTAS IMPORTANTES

1. **GitHub Token** debe tener scope `repo` completo
2. **Credenciales** en configs son para capturas automáticas con Playwright
3. **Screenshots** se guardan con los nombres definidos en `capture` array
4. **README/CHANGELOG** se envuelven en bloques de código para evitar errores MDX
5. **Node 22** es compatible - no necesitas downgrade

---

## 🔗 RECURSOS

- Docusaurus Docs: https://docusaurus.io/docs
- Octokit GitHub API: https://github.com/octokit/octokit.js
- Playwright Docs: https://playwright.dev/
- tsx (TypeScript executor): https://github.com/privatenumber/tsx

---

**ÚLTIMA ACTUALIZACIÓN:** 2024-11-27
**AUTOR:** KOR Solutions
**VERSIÓN:** 1.0.0
