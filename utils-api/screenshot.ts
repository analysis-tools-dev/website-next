import { Octokit } from '@octokit/core';
import { isScreenshotApiData } from 'utils/type-guards';
import { Screenshot, ScreenshotApiData } from 'utils/types';

let screenshotCache: ScreenshotApiData | null = null;

/**
 * Fetch screenshot data from GitHub
 */
async function getScreenshotData(): Promise<ScreenshotApiData | null> {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools',
    });

    try {
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
    } catch (error) {
        console.error('Error fetching screenshots:', error);
        return null;
    }
}

/**
 * Retrieve all screenshots from analysis-tools-dev/assets/screenshots.json
 * Uses in-memory caching for the duration of the build
 */
export const getAllScreenshots =
    async (): Promise<ScreenshotApiData | null> => {
        if (screenshotCache) {
            return screenshotCache;
        }

        const screenshots = await getScreenshotData();
        if (screenshots) {
            screenshotCache = screenshots;
        }
        return screenshots;
    };

/**
 * Get all screenshots for a specific tool
 * @param tool - Tool ID to get screenshots for
 * @returns Array of screenshots for the tool
 */
export const getScreenshots = async (tool: string): Promise<Screenshot[]> => {
    const screenshots = await getAllScreenshots();
    if (!screenshots) {
        return [];
    }
    const toolScreenshots = screenshots[tool];
    if (!toolScreenshots) {
        return [];
    }
    return toolScreenshots;
};
