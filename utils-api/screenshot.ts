import { Octokit } from '@octokit/core';
import { getCacheManager } from './cache';

const SCREENSHOTS_CACHE_TTL = 60 * 60 * 24 * 7;

const cacheDataManager = getCacheManager(SCREENSHOTS_CACHE_TTL);

export const getScreenshots = async (tool: string) => {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    const cacheKey = `screenshots-${tool}`;

    try {
        // Get data from cache
        let screenshots = await cacheDataManager.get(cacheKey);
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

            // TODO: Cleanup and add TypeGuards

            const data = response.data as any;

            // extract download url from response data
            screenshots = data.map((screenshot: any) => {
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
            await cacheDataManager.set(cacheKey, screenshots);
        }
        return screenshots;
    } catch (e) {
        console.error('Error occurred: ', JSON.stringify(e));
        await cacheDataManager.del(cacheKey);
        return null;
    }
};
