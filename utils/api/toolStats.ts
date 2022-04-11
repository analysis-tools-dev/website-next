import NodeCache from 'node-cache';
import { Octokit } from '@octokit/core';

const cacheData = new NodeCache();

export async function getToolStats() {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    const cacheKey = 'tool_stats';
    try {
        let data: any = cacheData.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exists - calling API`,
            );
            // Call API and refresh cache
            const response = await octokit.request(
                'GET /repos/{owner}/{repo}/contents/{path}',
                {
                    owner: 'analysis-tools-dev',
                    repo: 'static-analysis',
                    path: 'data/api/stats/tools.json',
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
        // TODO: Add typeguard
        return data || null;
    } catch (e) {
        console.log('Error occured: ', JSON.stringify(e));
        cacheData.del(cacheKey);
        return null;
    }
}
