import { RepositoryData } from '@components/tools/types';
import { getCacheManager } from './cache';
import { createThrottledOctokit } from './githubClient';

const cacheDataManager = getCacheManager();

export const getGithubStats = async (
    toolId: string,
    owner: string,
    repo: string,
): Promise<RepositoryData | null> => {
    const octokit = createThrottledOctokit();
    const cacheKey = `${toolId}_github_data`;

    try {
        // Get tool data from cache
        let data: RepositoryData | undefined = await cacheDataManager.get(
            cacheKey,
        );
        if (!owner || !repo) {
            return null;
        }
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exist - calling API`,
            );
            // Call API and refresh cache
            const response = await octokit.request(
                'GET /repos/{owner}/{repo}',
                {
                    owner,
                    repo,
                },
            );
            if (response.data) {
                data = {
                    source: response.data.html_url,
                    name: response.data.name,
                    stars: response.data.stargazers_count,
                    issues: response.data.open_issues,
                    forks: response.data.forks,
                    created: response.data.created_at,
                    updated: response.data.updated_at,
                    owner: owner,
                };
                const hours = Number(process.env.API_CACHE_TTL) || 24;
                await cacheDataManager.set(cacheKey, data, hours * 60 * 60);
            } else {
                console.error(`Could not find stats for tool: ${toolId}`);
                return null;
            }
        }
        return data;
    } catch (e) {
        console.error(e);
        return null;
    }
};
