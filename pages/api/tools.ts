import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/core';
import { filterResults, isToolsApiData, type ApiTool } from 'utils';
import cacheData from 'memory-cache';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiTool[] | { error: string }>,
) {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    // TODO: Improve cache by adding entire request with filters in key
    const cacheKey = 'tools_data';

    try {
        // Get data from cache
        let data = cacheData.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exists - calling API`,
            );
            // Data does not exist in cache or has expired
            // Call API and refresh cache
            const hours = Number(process.env.API_CACHE_TTL) || 24;
            const response = await octokit.request(
                'GET /repos/{owner}/{repo}/contents/{path}',
                {
                    owner: 'analysis-tools-dev',
                    repo: 'static-analysis',
                    path: 'data/api/tools.json',
                    headers: {
                        accept: 'application/vnd.github.VERSION.raw',
                    },
                },
            );
            data = JSON.parse(response.data.toString());
            if (data) {
                cacheData.put(cacheKey, data, hours * 1000 * 60 * 60);
            }
        }

        if (!isToolsApiData(data)) {
            res.status(500).json({ error: 'Failed to load data' });
            cacheData.del(cacheKey);
            return res;
        }

        res.status(200).json(filterResults(data, req));
    } catch (e) {
        console.log('Error occured: ', JSON.stringify(e));
        res.status(500).json({ error: 'Failed to load data' });
        cacheData.del(cacheKey);
        return res;
    }
}
