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
  capture?: Array<{
    route: string;
    name: string;
  }>;
}
