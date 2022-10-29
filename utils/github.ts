// If the source is a github repo, return the owner and repo
export const getRepositoryMeta = (source: string | null) => {
    if (!source) {
        return null;
    }
    const githubRegex = /github\.com\/([^/]+)\/([^/]+)/;
    const match = source.match(githubRegex);
    if (match) {
        return {
            owner: match[1],
            repo: match[2],
        };
    }
};
