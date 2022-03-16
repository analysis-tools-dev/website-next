import cacheData from 'memory-cache';
import { Octokit } from '@octokit/core';

export async function getToolStats() {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    const statsCacheKey = 'tool_stats';
    try {
        let data = cacheData.get(statsCacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${statsCacheKey} does not exists - calling API`,
            );
            // Call API and refresh cache
            const response = await octokit.request(
                'GET /repos/{owner}/{repo}/contents/{path}',
                {
                    owner: 'analysis-tools-dev',
                    repo: 'static-analysis',
                    path: 'data/api/stats.json',
                    headers: {
                        accept: 'application/vnd.github.VERSION.raw',
                    },
                },
            );
            data = JSON.parse(response.data.toString());
            if (data) {
                const hours = Number(process.env.API_CACHE_TTL) || 24;
                cacheData.put(statsCacheKey, data, hours * 1000 * 60 * 60);
            }
        }
        return data || null;
    } catch (e) {
        console.log('Error occured: ', JSON.stringify(e));
        cacheData.del(statsCacheKey);
        return null;
    }
}
