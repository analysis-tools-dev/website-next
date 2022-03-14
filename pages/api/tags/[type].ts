import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/core';
import { type ApiTool, isToolsApiData } from 'utils';
import cacheData from 'memory-cache';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiTool | { error: string }>,
) {
    const { type } = req.query;

    if (!type) {
        res.status(500);
        return res;
    }

    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    // TODO: Possibly improve cache by adding entire requested toolID and storing tool data instead of entire JSON?
    const cacheKey = `tags_${type}`;

    try {
        // Get tool data from cache
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
                    path: `data/api/tags.json`,
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

        // TODO: Update to match tags and filter tags based on type
        if (!isToolsApiData(data)) {
            res.status(500).json({ error: 'Failed to load data' });
            cacheData.del(cacheKey);
            return res;
        }

        const toolId = '';
        const tool = data[toolId.toString()];
        if (!tool) {
            res.status(404).json({
                error: `Could not find tool: ${toolId.toString()}`,
            });
            return res;
        }

        res.status(200).json(tool);
        return res;
    } catch (e) {
        console.log('Error occured: ', JSON.stringify(e));
        res.status(500).json({ error: 'Failed to load data' });
        cacheData.del(cacheKey);
        return res;
    }
}
