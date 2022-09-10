import { Octokit } from '@octokit/core';

import cacheManager from 'cache-manager';
import fsStore from 'cache-manager-fs-hash';

const cacheData = cacheManager.caching({
    store: fsStore,
    options: {
        path: 'diskcache', // path for cached files
        ttl: 60 * 60 * 24 * 7, // time to life in seconds
        subdirs: false, // create subdirectories
        zip: false, // zip files to save diskspace (default: false)
    },
});

export const getScreenshots = async (tool: string) => {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    const cacheKey = `screenshots-${tool}`;

    try {
        // Get data from cache
        let screenshots = await cacheData.get(cacheKey);
        if (!screenshots) {
            console.log(
                `Cache data for: ${cacheKey} does not exist - calling API`,
            );

            // Call API and refresh cache
            const response = await octokit.request(
                'GET /repos/{owner}/{repo}/contents/{path}',
                {
                    owner: 'analysis-tools-dev',
                    repo: 'assets',
                    path: `screenshots/${tool}`,
                    headers: {
                        accept: 'application/vnd.github+json',
                    },
                },
            );

            // extract download url from response data
            screenshots = response.data.map((screenshot: any) => {
                return {
                    original: screenshot.download_url,
                    // get part behind last slash in download url and decode as url
                    // decode twice (first for github API, second for filename URL encoding)
                    // remove file extension
                    url: decodeURIComponent(
                        decodeURIComponent(
                            screenshot.download_url
                                .split('/')
                                .pop()
                                .replace(/\.[^/.]+$/, ''),
                        ),
                    ),
                };
            });
            const hours = Number(process.env.API_CACHE_TTL) || 24;
            await cacheData.set(cacheKey, screenshots, hours * 60 * 60);
        }
        return screenshots;
    } catch (e) {
        console.error('Error occurred: ', JSON.stringify(e));
        await cacheData.del(cacheKey);
        return null;
    }
};
