import cacheData from 'memory-cache';
import { Octokit } from '@octokit/core';
import { isToolsApiData } from 'utils';

export async function getTools() {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    // TODO: Improve cache by adding entire request with filters in key
    const toolsCacheKey = 'tools_data';

    try {
        // Get data from cache
        let data = cacheData.get(toolsCacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${toolsCacheKey} does not exists - calling API`,
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
                cacheData.put(toolsCacheKey, data, hours * 1000 * 60 * 60);
            }
        }
        if (!isToolsApiData(data)) {
            return null;
        }
        return data;
    } catch (e) {
        console.log('Error occured: ', JSON.stringify(e));
        cacheData.del(toolsCacheKey);
        return null;
    }
}
