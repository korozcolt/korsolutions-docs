import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

import { Browser, Page, chromium } from 'playwright';

import { GithubProjectConfig } from '../types/project-config';
import { Octokit } from '@octokit/rest';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

interface CaptureRoute {
  route: string;
  name: string;
}

async function getCaptureRoutes(config: GithubProjectConfig): Promise<CaptureRoute[]> {
  try {
    console.log('  📋 Obteniendo rutas desde docusaurus.json...');
    const response = await octokit.rest.repos.getContent({
      owner: config.repoOwner,
      repo: config.repoName,
      path: 'docusaurus.json',
    });

    if ('content' in response.data) {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      const routes = JSON.parse(content) as CaptureRoute[];
      console.log(`  ✅ ${routes.length} rutas encontradas en docusaurus.json`);
      return routes;
    }
  } catch (error: any) {
    if (error.status === 404) {
      console.log('  ⚠️  docusaurus.json no encontrado, usando rutas de configuración');
    } else {
      console.error('  ❌ Error al obtener docusaurus.json:', error.message);
    }
  }

  // Fallback a rutas de configuración si existe
  return config.capture || [];
}

function generateManualMdx(
  config: GithubProjectConfig,
  metadata: Array<{ filename: string; title: string; path: string; route: string }>
) {
  console.log(`  📝 Generando manual.mdx con ${metadata.length} capturas...`);
  
  const manualPath = path.join(config.documentationPath, 'manual.mdx');
  
  let content = `---
sidebar_position: 10
title: Manual de Función
---

# 📖 Manual de Función - ${config.name.toUpperCase()}

Este manual contiene las capturas de pantalla de todas las funcionalidades del sistema.

:::info Actualización Automática
Ejecuta \`npm run capture ${config.name}\` para regenerar todas las capturas automáticamente desde la aplicación en vivo.
Las capturas se generan usando Playwright conectándose a ${config.baseUrl}
:::

## 🖼️ Capturas del Sistema

`;

  // Agrupar por sección (basado en prefijo de route)
  const sections = new Map<string, typeof metadata>();
  
  metadata.forEach(item => {
    const routeParts = item.route.split('/').filter(Boolean);
    const section = routeParts.length > 0 ? routeParts[0] : 'home';
    
    if (!sections.has(section)) {
      sections.set(section, []);
    }
    sections.get(section)!.push(item);
  });

  // Generar contenido por secciones
  sections.forEach((items, section) => {
    content += `\n### ${section.charAt(0).toUpperCase() + section.slice(1)}\n\n`;
    
    items.forEach(item => {
      content += `#### ${item.title}\n\n`;
      content += `![${item.title}](${item.path})\n\n`;
      content += `**Ruta:** \`${item.route}\`\n\n`;
      content += `---\n\n`;
    });
  });

  fs.writeFileSync(manualPath, content);
  console.log(`  ✅ manual.mdx generado con ${metadata.length} capturas organizadas por sección`);
}

async function captureScreenshots(config: GithubProjectConfig) {
  console.log(`\n📸 Capturando screenshots: ${config.name}`);
  
  const screenshotsDir = path.join(config.documentationPath, 'screenshots');
  
  // Crear directorio si no existe
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const metadata: Array<{ filename: string; title: string; path: string; route: string }> = [];

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    // Iniciar navegador
    console.log('  🌐 Iniciando navegador...');
    browser = await chromium.launch({
      headless: true,
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true,
    });

    page = await context.newPage();

    // Login
    console.log(`  🔐 Realizando login en ${config.loginUrl}...`);
    await page.goto(`${config.baseUrl}${config.loginUrl}`, { waitUntil: 'networkidle' });
    
    // Intentar diferentes selectores de login comunes
    const emailSelectors = [
      'input[type="email"]',
      'input[name="email"]',
      'input[id="email"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="correo" i]',
    ];
    
    const passwordSelectors = [
      'input[type="password"]',
      'input[name="password"]',
      'input[id="password"]',
    ];

    let emailInput = null;
    for (const selector of emailSelectors) {
      try {
        emailInput = await page.waitForSelector(selector, { timeout: 2000 });
        if (emailInput) break;
      } catch (_e) {
        continue;
      }
    }

    let passwordInput = null;
    for (const selector of passwordSelectors) {
      try {
        passwordInput = await page.waitForSelector(selector, { timeout: 2000 });
        if (passwordInput) break;
      } catch (_e) {
        continue;
      }
    }

    if (emailInput && passwordInput) {
      await emailInput.fill(config.credentials.email);
      await passwordInput.fill(config.credentials.password);
      
      // Intentar encontrar botón de submit
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:has-text("Login")',
        'button:has-text("Iniciar")',
        'button:has-text("Entrar")',
      ];

      for (const selector of submitSelectors) {
        try {
          const submitButton = await page.$(selector);
          if (submitButton) {
            await submitButton.click();
            break;
          }
        } catch (_e) {
          continue;
        }
      }

      // Esperar a que se complete el login
      await page.waitForTimeout(3000);
      console.log('  ✅ Login completado');
    } else {
      console.log('  ⚠️  No se pudo encontrar formulario de login, continuando...');
    }

    // Obtener rutas de captura
    const captureRoutes = await getCaptureRoutes(config);

    if (captureRoutes.length === 0) {
      console.log('  ⚠️  No hay rutas configuradas para capturar');
      return;
    }

    // Capturar screenshots de cada ruta
    for (const capture of captureRoutes) {
      console.log(`  📷 Capturando ${capture.name}...`);
      
      try {
        await page.goto(`${config.baseUrl}${capture.route}`, {
          waitUntil: 'networkidle',
          timeout: 30000,
        });

        // Esperar un poco para que se cargue completamente
        await page.waitForTimeout(2000);

        const screenshotPath = path.join(screenshotsDir, `${capture.name}.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: false,
        });

        // Agregar metadata (path ya no se usa, se carga con require en el componente)
        metadata.push({
          filename: `${capture.name}.png`,
          title: capture.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          path: `./screenshots/${capture.name}.png`, // Mantenido para compatibilidad pero no se usa
          route: capture.route,
        });

        console.log(`  ✅ ${capture.name}.png guardado`);
      } catch (error: any) {
        console.error(`  ❌ Error capturando ${capture.name}:`, error.message);
      }
    }

    // Guardar metadata
    const metadataPath = path.join(screenshotsDir, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`  💾 Metadata guardado: ${metadata.length} capturas`);

    // Generar archivo manual.mdx con todas las capturas
    generateManualMdx(config, metadata);

  } catch (error: any) {
    console.error(`  ❌ Error durante la captura:`, error.message);
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}

async function main() {
  const projectName = process.argv[2];

  if (!projectName) {
    console.error('❌ Uso: npm run capture <proyecto>');
    console.error('   Proyectos disponibles: sigma, pqr, archivemaster, volleypass');
    process.exit(1);
  }

  let config: GithubProjectConfig;

  switch (projectName) {
    case 'sigma':
      config = (await import('./config/sigma.config')).sigmaConfig;
      break;
    case 'pqr':
      config = (await import('./config/pqr.config')).pqrConfig;
      break;
    case 'archivemaster':
      config = (await import('./config/archivemaster.config')).archivemasterConfig;
      break;
    case 'volleypass':
      config = (await import('./config/volleypass.config')).volleypassConfig;
      break;
    default:
      console.error(`❌ Proyecto desconocido: ${projectName}`);
      console.error('   Proyectos disponibles: sigma, pqr, archivemaster, volleypass');
      process.exit(1);
  }

  await captureScreenshots(config);
  console.log(`\n✨ Capturas completadas\n`);
}

main();
