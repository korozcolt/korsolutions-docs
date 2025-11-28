import { GithubProjectConfig } from '../../types/project-config';

export const archivemasterConfig: GithubProjectConfig = {
  name: 'archivemaster',
  repoOwner: 'korozcolt',
  repoName: 'archive-master-app',
  documentationPath: 'docs/archivemaster',
  baseUrl: 'https://archive-master-app.test',
  loginUrl: '/admin/login',
  credentials: {
    email: 'ing.korozco@gmail.com',
    password: 'Q@10op29+'
  }
  // Las rutas de captura se leen automáticamente desde docusaurus.json en GitHub
};
