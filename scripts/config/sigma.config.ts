import { GithubProjectConfig } from '../../types/project-config';

export const sigmaConfig: GithubProjectConfig = {
  name: 'sigma',
  repoOwner: 'korozcolt',
  repoName: 'sigma-project',
  documentationPath: 'docs/sigma',
  baseUrl: 'https://sigma-project.test',
  loginUrl: '/admin/login',
  credentials: {
    email: 'ing.korozco@gmail.com',
    password: 'Admin123'
  }
  // Las rutas de captura se leen automáticamente desde docusaurus.json en GitHub
};
