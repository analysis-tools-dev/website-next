// If the source is a github repo, return the owner and repo
export const getRepositoryMeta = (source: string) => {
    const githubRegex = /github\.com\/([^/]+)\/([^/]+)/;
    const githubMatch = source.match(githubRegex);

    if (githubMatch) {
        return {
            owner: githubMatch[1],
            repo: githubMatch[2],
        };
    }
};
