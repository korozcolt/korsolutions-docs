import { GithubProjectConfig } from '../../types/project-config';

export const volleypassConfig: GithubProjectConfig = {
  name: 'volleypass',
  repoOwner: 'korozcolt',
  repoName: 'volleypass-new',
  documentationPath: 'docs/volleypass',
  baseUrl: 'https://volleypass-new.test',
  loginUrl: '/admin/login',
  credentials: {
    email: 'ing.korozco+admin@gmail.com',
    password: 'Admin123'
  }
  // Las rutas de captura se leen automáticamente desde docusaurus.json en GitHub
};
