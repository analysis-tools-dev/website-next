import { Octokit } from '@octokit/core';
import { isScreenshotApiData } from 'utils/type-guards';
import { Screenshot, ScreenshotApiData } from 'utils/types';
import { getCacheManager } from './cache';

async function getScreenshotData() {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools',
    });

    const response = await octokit.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
            owner: 'analysis-tools-dev',
            repo: 'assets',
            path: 'screenshots.json',
            headers: {
                accept: 'application/vnd.github.raw',
            },
        },
    );

    const data = JSON.parse(response.data.toString());
    if (!isScreenshotApiData(data)) {
        console.error('Screenshot TypeError');
        return null;
    }
    return data;
}

// Retrieve `analysis-tools-dev/assets/screenshots.json` file
// and cache it for 24 hours
export const getAllScreenshots =
    async (): Promise<ScreenshotApiData | null> => {
        const cacheDataManager = getCacheManager();
        const cacheKey = 'screenshots';

        // Get data from cache
        const screenshots: ScreenshotApiData = (await cacheDataManager.get(
            cacheKey,
        )) as ScreenshotApiData;

        if (!screenshots) {
            console.log(
                `Cache data for: ${cacheKey} does not exist - calling API`,
            );
            const screenshots = await getScreenshotData();
            await cacheDataManager.set(cacheKey, screenshots);
        }
        return screenshots;
    };

// Get all screenshots for a specific tool
export const getScreenshots = async (tool: string): Promise<Screenshot[]> => {
    const screenshots = await getAllScreenshots();
    if (!screenshots) {
        return [];
    }
    const r = screenshots[tool];
    if (!r) {
        return [];
    }
    return r;
};
