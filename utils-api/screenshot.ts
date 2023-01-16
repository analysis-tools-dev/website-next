import { Octokit } from '@octokit/core';
import { getCacheManager } from './cache';

// Type for screenshot data
// Format:
// {
//     "tool": [
//         {
//           "path": "path/to/screenshot1",
//           "url": "https://example.com",
//         },
//         {
//           "path": "path/to/screenshot2",
//           "url": "https://example.com",
//         }
//     ],
//     "tool2": [
//           ...
//     ],
// }

export type Screenshot = {
    path: string;
    url: string;
};

export type Screenshots = {
    [key: string]: Screenshot[];
};

async function downloadScreenshotsFile() {
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

    // TODO: Fix type error
    // @ts-ignore
    return JSON.parse(response.data);
}

// Retrieve `analysis-tools-dev/assets/screenshots.json` file
// and cache it for 24 hours
export const getAllScreenshots = async (): Promise<Screenshots | null> => {
    const cacheDataManager = getCacheManager();
    const cacheKey = 'screenshots';

    // Get data from cache
    const screenshots: Screenshots = (await cacheDataManager.get(
        cacheKey,
    )) as Screenshots;

    if (!screenshots) {
        console.log(`Cache data for: ${cacheKey} does not exist - calling API`);
        const screenshots = await downloadScreenshotsFile();
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
    console.log('Found ' + r.length + ' screenshot(s) for ' + tool);
    if (!r) {
        return [];
    }
    return r;
};
