import { GithubProjectConfig } from '../../types/project-config';

export const pqrConfig: GithubProjectConfig = {
  name: 'pqr',
  repoOwner: 'korozcolt',
  repoName: 'sistema-pqrsd',
  documentationPath: 'docs/pqr',
  baseUrl: 'https://sistema-pqrsd.test',
  loginUrl: '/admin/login',
  credentials: {
    email: 'ing.korozco@gmail.com',
    password: 'Admin123'
  }
  // Las rutas de captura se leen automáticamente desde docusaurus.json en GitHub
};
