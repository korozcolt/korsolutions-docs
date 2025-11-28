import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

import { GithubProjectConfig } from '../types/project-config';
import { Octokit } from '@octokit/rest';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Función para escapar caracteres problemáticos en MDX y limpiar links internos
function escapeMdxCharacters(content: string): string {
  return content
    // Eliminar links a archivos .md internos del repo (PROGRESO.md, CLAUDE.md, etc.)
    // Esto evita warnings de "couldn't be resolved"
    .replace(/\[([^\]]+)\]\(([^)]*\.md)\)/g, '**$1**')
    // Escapar < seguido de número (ej: <500ms -> \<500ms)
    .replace(/<(\d)/g, '\\<$1')
    // Escapar > seguido de número (ej: >500ms -> \>500ms)
    .replace(/>(\d)/g, '\\>$1');
    // NO escapar < o > en etiquetas HTML válidas
    // NO escapar {} - MDX los maneja correctamente en contexto markdown
}

async function syncProject(config: GithubProjectConfig) {
  console.log(`\n🔄 Sincronizando proyecto: ${config.name}`);
  
  const githubDir = path.join(config.documentationPath, 'github');
  
  // Crear directorio si no existe
  if (!fs.existsSync(githubDir)) {
    fs.mkdirSync(githubDir, { recursive: true });
  }

  try {
    // 1. Sincronizar README
    console.log(`  📄 Descargando README...`);
    try {
      const readmeResponse = await octokit.rest.repos.getReadme({
        owner: config.repoOwner,
        repo: config.repoName,
      });

      const readmeContent = Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');
      
      // Guardar como .md (raw markdown)
      fs.writeFileSync(
        path.join(githubDir, 'README.md'),
        readmeContent
      );
      
      // También crear versión .mdx procesada para importar (escapar caracteres problemáticos)
      const readmeMdx = escapeMdxCharacters(readmeContent);
      fs.writeFileSync(
        path.join(githubDir, 'README_CONTENT.mdx'),
        readmeMdx
      );
      
      console.log(`  ✅ README sincronizado`);
    } catch (error: any) {
      if (error.status === 404) {
        console.log(`  ⚠️  README no encontrado en el repositorio`);
      } else {
        throw error;
      }
    }

    // 2. Sincronizar CHANGELOG
    console.log(`  📋 Descargando CHANGELOG...`);
    try {
      const changelogResponse = await octokit.rest.repos.getContent({
        owner: config.repoOwner,
        repo: config.repoName,
        path: 'CHANGELOG.md',
      });

      if ('content' in changelogResponse.data) {
        const changelogContent = Buffer.from(changelogResponse.data.content, 'base64').toString('utf-8');
        
        // Guardar como .md (raw markdown)
        fs.writeFileSync(
          path.join(githubDir, 'CHANGELOG.md'),
          changelogContent
        );
        
        // También crear versión .mdx procesada para importar (escapar caracteres problemáticos)
        const changelogMdx = escapeMdxCharacters(changelogContent);
        fs.writeFileSync(
          path.join(githubDir, 'CHANGELOG_CONTENT.mdx'),
          changelogMdx
        );
        
        console.log(`  ✅ CHANGELOG sincronizado`);
      }
    } catch (error: any) {
      if (error.status === 404) {
        console.log(`  ⚠️  CHANGELOG no encontrado en el repositorio`);
      } else {
        throw error;
      }
    }

    // 3. Obtener últimos 10 commits
    console.log(`  🔖 Obteniendo últimos commits...`);
    const commitsResponse = await octokit.rest.repos.listCommits({
      owner: config.repoOwner,
      repo: config.repoName,
      per_page: 10,
    });

    const commits = commitsResponse.data.map(commit => ({
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message,
      author: commit.commit.author?.name || 'Unknown',
      date: commit.commit.author?.date || '',
      url: commit.html_url,
    }));

    fs.writeFileSync(
      path.join(githubDir, 'COMMITS.json'),
      JSON.stringify(commits, null, 2)
    );
    console.log(`  ✅ ${commits.length} commits guardados`);

  } catch (error: any) {
    console.error(`  ❌ Error sincronizando ${config.name}:`, error.message);
    throw error;
  }
}

async function main() {
  const projectName = process.argv[2];

  if (!process.env.GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN no encontrado en .env');
    process.exit(1);
  }

  if (!projectName) {
    console.error('❌ Uso: npm run sync <proyecto>');
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

  await syncProject(config);
  console.log(`\n✨ Sincronización completada\n`);
}

main();
