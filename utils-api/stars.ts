// Gets the star records for a repo
// The JSON file with the stars per repo is located at
// https://raw.githubusercontent.com/analysis-tools-dev/stars/master/stars.json
// It has the following format:
// {
//   "repo": [
//     {
//        "starred_at": "2013-08-01",
//        "count": 0
//      },
//      {
//        "starred_at": "2013-08-01",
//        "count": 30
//      },
//      {
//        "starred_at": "2013-08-06",
//        "count": 60
//      }
//   ], ...
// }
// It can be cached for 7 days

import { Octokit } from '@octokit/core';
import { isAllStarHistoryData } from 'utils/type-guards';
import { StarHistory, StarHistoryApiData } from 'utils/types';
import { getCacheManager } from './cache';

const cacheDataManager = getCacheManager(7 * 24 * 60 * 60);

async function getAllStarHistoryData() {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools',
    });

    const response = await octokit.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
            owner: 'analysis-tools-dev',
            repo: 'stars',
            path: 'stars.json',
            headers: {
                accept: 'application/vnd.github.raw',
            },
        },
    );

    const data = JSON.parse(response.data.toString());
    if (!isAllStarHistoryData(data)) {
        console.error('Star History TypeError');
        return null;
    }
    return data;
}

const getAllStarHistory = async () => {
    const cacheKey = 'starHistory';

    // Get data from cache
    const allStarHistory: StarHistoryApiData = (await cacheDataManager.get(
        cacheKey,
    )) as StarHistoryApiData;

    if (!allStarHistory) {
        console.log(`Cache data for: ${cacheKey} does not exist - calling API`);
        const allStarHistory = await getAllStarHistoryData();
        await cacheDataManager.set(cacheKey, allStarHistory);
    }
    return allStarHistory;
};

export const getRepoStarRecords = async (toolId: string) => {
    const allStarHistory = await getAllStarHistory();
    if (!allStarHistory) {
        return null;
    }
    const stars = allStarHistory[toolId];

    if (!stars) {
        console.error(`Could not find ${toolId} star history`);
        return null;
    }

    console.log(`Found ${stars.length} star records for ${toolId}!`);
    return stars as StarHistory;
};
