export const INDEX_DATA_CONFIG = {
  githubOwner: process.env.INDEX_DATA_GITHUB_OWNER || "fermatmind",
  githubRepo: process.env.INDEX_DATA_GITHUB_REPO || "88cn-index-data",
  githubBranch: process.env.INDEX_DATA_GITHUB_BRANCH || "main",
  localPath: process.env.INDEX_DATA_LOCAL_PATH || "../88cn-index-data",
  get hasGitHubToken(): boolean {
    return !!process.env.INDEX_DATA_GITHUB_TOKEN;
  },
} as const;
