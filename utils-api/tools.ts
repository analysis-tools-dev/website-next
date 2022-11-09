import { type Tool } from '@components/tools';
import { Octokit } from '@octokit/core';
import { getRepoStarRecords } from 'utils/stars';
import { getRepositoryMeta } from 'utils/github';
import { isToolsApiData } from 'utils/type-guards';
import { getCacheManager } from './cache';
import { getGithubStats } from './github';

const cacheDataManager = getCacheManager();

export const getTools = async () => {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    // TODO: Improve cache by adding entire request with filters in key
    const cacheKey = 'tools_data';

    try {
        // Get data from cache
        let data = await cacheDataManager.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exist - calling API`,
            );
            // Call API and refresh cache
            const response = await octokit.request(
                'GET /repos/{owner}/{repo}/contents/{path}',
                {
                    owner: 'analysis-tools-dev',
                    repo: 'static-analysis',
                    path: 'data/api/tools.json',
                    headers: {
                        accept: 'application/vnd.github.VERSION.raw',
                    },
                },
            );
            data = JSON.parse(response.data.toString());
            if (data) {
                const hours = Number(process.env.API_CACHE_TTL) || 24;
                await cacheDataManager.set(cacheKey, data, hours * 60 * 60);
            }
        }
        if (!isToolsApiData(data)) {
            await cacheDataManager.del(cacheKey);
            console.error('Tools TypeError');
            return null;
        }
        return data;
    } catch (e) {
        console.error('Error occurred: ', JSON.stringify(e));
        await cacheDataManager.del(cacheKey);
        return null;
    }
};

export const getTool = async (toolId: string) => {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    const cacheKey = 'tools_data';

    try {
        // Get data from cache
        let data = await cacheDataManager.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exist - calling API`,
            );
            // Call API and refresh cache
            const response = await octokit.request(
                'GET /repos/{owner}/{repo}/contents/{path}',
                {
                    owner: 'analysis-tools-dev',
                    repo: 'static-analysis',
                    path: 'data/api/tools.json',
                    headers: {
                        accept: 'application/vnd.github.VERSION.raw',
                    },
                },
            );

            data = JSON.parse(response.data.toString());
            if (data) {
                const hours = Number(process.env.API_CACHE_TTL) || 24;
                await cacheDataManager.set(cacheKey, data, hours * 60 * 60);
            } else {
                console.error(`Could not load tools data`);
                return null;
            }
        }

        if (!isToolsApiData(data)) {
            await cacheDataManager.del(cacheKey);
            console.error('Tools TypeError');
            return null;
        }

        let tool = data[toolId];
        if (!tool) {
            console.error(`Could not find ${toolId} data`);
            return null;
        }

        const repoMeta = getRepositoryMeta(tool.source);
        if (repoMeta) {
            const repositoryData = await getGithubStats(
                toolId,
                repoMeta.owner,
                repoMeta.repo,
            );
            const stars = await getRepoStarRecords(
                `${repoMeta.owner}/${repoMeta.repo}`,
                process.env.GH_TOKEN || '',
                10,
            );
            tool = {
                ...tool,
                ...(repositoryData ? { repositoryData: repositoryData } : {}),
                ...(stars ? { stars: stars } : {}),
            };
        }
        return tool as Tool;
    } catch (e) {
        console.error('Error occurred: ', JSON.stringify(e));
        await cacheDataManager.del(cacheKey);
        return null;
    }
};
