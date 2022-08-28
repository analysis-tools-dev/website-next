import { Octokit } from '@octokit/core';
import { ToolsByLanguage } from '@components/tools';
import { isStatsApiData } from 'utils/type-guards';

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

export async function getStats(file: string) {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    const cacheKey = `${file}_stats`;
    try {
        let data: any = await cacheData.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exist - calling API`,
            );
            // Call API and refresh cache
            const response = await octokit.request(
                'GET /repos/{owner}/{repo}/contents/data/api/stats/{file}.json',
                {
                    owner: 'analysis-tools-dev',
                    repo: 'static-analysis',
                    file,
                    headers: {
                        accept: 'application/vnd.github.VERSION.raw',
                    },
                },
            );
            data = JSON.parse(response.data.toString());
            if (data) {
                const hours = Number(process.env.API_CACHE_TTL) || 24;
                await cacheData.set(cacheKey, data, hours * 60 * 60);
            }
        }
        if (!isStatsApiData(data)) {
            await cacheData.del(cacheKey);
            console.error('Stats TypeError');
            return null;
        }
        return data;
    } catch (e) {
        console.error('Error occurred: ', JSON.stringify(e));
        await cacheData.del(cacheKey);
        return null;
    }
}

export async function getToolStats() {
    return await getStats('tools');
}

export async function getLanguageStats() {
    const stats = await getStats('tags');
    if (!stats) {
        return null;
    }

    const sortedLanguageStats: ToolsByLanguage = Object.entries(stats)
        .sort(([, a], [, b]) => Number(b) - Number(a))
        .reduce(
            (r, [key, value]) => ({
                ...r,
                [key.split('/tag/').join('')]: {
                    views: Number(value),
                    formatters: [],
                    linters: [],
                },
            }),
            {},
        );
    return sortedLanguageStats;
}
