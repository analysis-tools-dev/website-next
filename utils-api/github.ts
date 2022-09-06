import { Octokit } from '@octokit/core';

import cacheManager from 'cache-manager';
import fsStore from 'cache-manager-fs-hash';

const cacheData = cacheManager.caching({
    store: fsStore,
    options: {
        path: 'diskcache', //path for cached files
        ttl: 60 * 60 * 24, //time to life in seconds
        subdirs: false, //create subdirectories
        zip: false, //zip files to save diskspace (default: false)
    },
});

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
        let data: any = await cacheData.get(cacheKey);
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
                };
                const hours = Number(process.env.API_CACHE_TTL) || 24;
                await cacheData.set(cacheKey, data, hours * 60 * 60);
            } else {
                console.error(`Could not find stats for tool: ${toolId}`);
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
