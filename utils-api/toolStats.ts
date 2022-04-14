import NodeCache from 'node-cache';
import { Octokit } from '@octokit/core';

const cacheData = new NodeCache();

export async function getStats(path: string) {
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
                    path,
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
        console.error('Error occurred: ', JSON.stringify(e));
        cacheData.del(cacheKey);
        return null;
    }
}

export async function getToolStats() {
    return getStats('data/api/stats/tools.json');
}

export async function getLanguageStats() {
    return getStats('data/api/stats/tags.json');
}
