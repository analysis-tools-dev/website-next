import NodeCache from 'node-cache';
import { Octokit } from '@octokit/core';
import { isToolsApiData } from 'utils/type-guards';

const cacheData = new NodeCache();

export const getTools = async () => {
    console.log('getTools');
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    // TODO: Improve cache by adding entire request with filters in key
    const cacheKey = 'tools_data';

    try {
        // Get data from cache
        let data = cacheData.get(cacheKey);
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
                cacheData.set(cacheKey, data, hours * 60 * 60);
            }
        }
        if (!isToolsApiData(data)) {
            cacheData.del(cacheKey);
            console.error('Tools TypeError');
            return null;
        }
        return data;
    } catch (e) {
        console.error('Error occurred: ', JSON.stringify(e));
        cacheData.del(cacheKey);
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
        let data = cacheData.get(cacheKey);
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
                cacheData.set(cacheKey, data, hours * 60 * 60);
            } else {
                console.error(`Could not load tools data`);
                return null;
            }
        }

        if (!isToolsApiData(data)) {
            cacheData.del(cacheKey);
            console.error('Tools TypeError');
            return null;
        }

        const tool = data[toolId];
        if (!tool) {
            console.error(`Could not find ${toolId} data`);
            return null;
        }
        return tool;
    } catch (e) {
        console.error('Error occurred: ', JSON.stringify(e));
        cacheData.del(cacheKey);
        return null;
    }
};
