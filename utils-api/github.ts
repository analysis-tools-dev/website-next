import NodeCache from 'node-cache';
import { Octokit } from '@octokit/core';

const cacheData = new NodeCache();

export const getRepositoryMeta = (source: string) => {
    if (!source || source === '') {
        return null;
    }
    const urlData = source.split('/');
    const baseIndex = urlData.findIndex((el) => el === 'github.com');
    if (!baseIndex) {
        return null;
    }
    return {
        owner: urlData[baseIndex + 1],
        repo: urlData[baseIndex + 2],
    };
};

export const getGithubStats = async (
    toolId: string,
    owner: string,
    repo: string,
) => {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    const cacheKey = `${toolId}_github_data`;

    try {
        // Get tool data from cache
        let data: any = cacheData.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exist - calling API`,
            );
            // Call API and refresh cache
            const response = await octokit.request(
                'GET /repos/{owner}/{repo}',
                {
                    owner: owner.toString(),
                    repo: repo.toString(),
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
                };
                const hours = Number(process.env.API_CACHE_TTL) || 24;
                cacheData.set(cacheKey, data, hours * 60 * 60);
            } else {
                console.error(
                    `Could not find stats for tool: ${toolId.toString()}`,
                );
                return null;
            }
        }
        // TODO: Add typeguard
        return data;
    } catch (e) {
        console.error(e);
        return null;
    }
};
