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

import { RepoStarsData } from '@components/tools';
import { Octokit } from '@octokit/core';
import { useQuery } from 'react-query';
import { isAllStarHistoryData } from 'utils/type-guards';
import { RepositoryMeta, StarHistoryApiData } from 'utils/types';
import { getCacheManager } from './cache';

/**
 * Fetches data from API using `useQuery` (react-query) or cache/prefetch data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useStarsQuery(repoMeta: RepositoryMeta) {
    return useQuery<RepoStarsData[]>(`stars-${repoMeta.repo}`, () =>
        fetchToolStars(repoMeta),
    );
}

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
        console.error('Screenshot TypeError');
        return null;
    }
    return data;
}

const getAllStarHistory = async () => {
    const cacheDataManager = getCacheManager(7 * 24 * 60 * 60);
    const cacheKey = 'screenshots';

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

export const getRepoStarRecords = async (repo: string) => {
    const allStarHistory = await getAllStarHistory();
    return allStarHistory[repo];
};

/**
 * Call API and return Promise to resolve `JSON` response
 * @desc Used as needed by `react-query` functions
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function fetchToolStars(
    repoMeta: RepositoryMeta,
): Promise<RepoStarsData[]> {
    return getRepoStarRecords(`${repoMeta.owner}/${repoMeta.repo}`).then(
        (response) => response,
    );
}
