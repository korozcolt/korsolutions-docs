import * as fs from 'fs';
import * as path from 'path';

interface ProjectSidebar {
  label: string;
  folder: string;
}

const projects: ProjectSidebar[] = [
  { label: 'SIGMA - Sistema Electoral', folder: 'sigma' },
  { label: 'Sistema PQRSD', folder: 'pqr' },
  { label: 'ArchiveMaster', folder: 'archivemaster' },
  { label: 'VolleyPass', folder: 'volleypass' },
];

function generateSidebar() {
  const docsPath = path.join(process.cwd(), 'docs');
  
  const sidebarItems = projects.map(project => {
    const projectPath = path.join(docsPath, project.folder);
    const githubPath = path.join(projectPath, 'github');
    
    const items: string[] = [`${project.folder}/readme`];
    
    // Verificar si existe CHANGELOG (archivo MDX compilable)
    const changelogMdxPath = path.join(githubPath, 'CHANGELOG_CONTENT.mdx');
    if (fs.existsSync(changelogMdxPath)) {
      items.push(`${project.folder}/changelog`);
    }
    
    // Siempre incluir manual de función
    items.push(`${project.folder}/manual`);
    
    return {
      type: 'category',
      label: project.label,
      link: { type: 'doc', id: `${project.folder}/intro` },
      items,
    };
  });

  const sidebarConfig = `import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Sidebar generado automáticamente
 * No editar manualmente - se regenera con npm run sync:all
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    ${sidebarItems.map(item => JSON.stringify(item, null, 4)).join(',\n    ')}
  ]
};

export default sidebars;
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'sidebars.ts'),
    sidebarConfig
  );
  
  console.log('✅ Sidebar generado correctamente');
}

generateSidebar();
