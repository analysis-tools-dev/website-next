import { Octokit } from '@octokit/core';
import { isTagsApiData } from 'utils/type-guards';

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

export const getTag = async (type: string) => {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    const cacheKey = `tags_${type}`;

    try {
        // Get tool data from cache
        let data = await cacheData.get(cacheKey);
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
                    path: `data/api/tags.json`,
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

        if (!isTagsApiData(data)) {
            console.error('Failed to load tags data');
            await cacheData.del(cacheKey);
            return null;
        }

        const requestedTags = data[type.toString()];
        if (!requestedTags) {
            console.error(`Could not load ${type} tags`);
            return null;
        }

        return requestedTags;
    } catch (e) {
        console.error('Error occurred: ', JSON.stringify(e));
        await cacheData.del(cacheKey);
        return null;
    }
};
