import { Octokit } from '@octokit/core';
import { isTagsApiData } from 'utils/type-guards';
import { getCacheManager } from './cache';

const cacheDataManager = getCacheManager();

export const getTag = async (type: string) => {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    const cacheKey = `tags_${type}`;

    try {
        // Get tool data from cache
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
                    path: `data/api/tags.json`,
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

        if (!isTagsApiData(data)) {
            console.error('Failed to load tags data');
            await cacheDataManager.del(cacheKey);
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
        await cacheDataManager.del(cacheKey);
        return null;
    }
};

export const getTags = async () => {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools',
    });

    const cacheKey = 'tags_data';

    try {
        // Get tool data from cache
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
                    path: `data/api/tags.json`,
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

        if (!isTagsApiData(data)) {
            console.error('Failed to load tags data');
            await cacheDataManager.del(cacheKey);
            return null;
        }

        return data;
    } catch (e) {
        console.error('Error occurred: ', JSON.stringify(e));
        await cacheDataManager.del(cacheKey);
        return null;
    }
};
