import { type Tool } from '@components/tools';
import { Octokit } from '@octokit/core';
import { getRepoStarRecords } from './stars';
import { getCacheManager } from './cache';
import { getGithubStats } from './github';
import { getRepositoryMeta } from 'utils/github';
import { isToolsApiData } from 'utils/type-guards';
import { ToolsApiData } from 'utils/types';
import fs from 'fs';

const cacheDataManager = getCacheManager();

export const getAllTools = async (): Promise<ToolsApiData> => {
    const staticAnalysisTools = await getTools('static-analysis');
    const dynamicAnalysisTools = await getTools('dynamic-analysis');

    return {
        ...staticAnalysisTools,
        ...dynamicAnalysisTools,
    };
};

export const getTools = async (repo: string): Promise<ToolsApiData | null> => {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    // TODO: Improve cache by adding entire request with filters in key
    const cacheKey = `${repo}_data`;

    try {
        // Get data from cache
        let data = await cacheDataManager.get(cacheKey);
        if (!data) {
            console.log(
                `[Tools] Cache data for ${cacheKey} does not exist. Calling API`,
            );
            // Call API and refresh cache
            const response = await octokit.request(
                'GET /repos/{owner}/{repo}/contents/{path}',
                {
                    owner: 'analysis-tools-dev',
                    repo: repo,
                    path: 'data/api/tools.json',
                    headers: {
                        accept: 'application/vnd.github.VERSION.raw',
                    },
                },
            );
            data = JSON.parse(response.data.toString()) as ToolsApiData;

            if (data) {
                const hours = Number(process.env.API_CACHE_TTL) || 24;
                await cacheDataManager.set(cacheKey, data, hours * 60 * 60);
            }
        }
        if (!isToolsApiData(data)) {
            console.error('Tools TypeError');
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

export const getTool = async (toolId: string): Promise<Tool | null> => {
    console.log(`[Tools] Fetching data for ${toolId}`);
    const tools = await getAllTools();
    if (!tools) {
        console.error('Could not load tools');
        return null;
    }

    let tool = tools[toolId];
    if (!tool) {
        console.error(`Could not find ${toolId} data`);
        return null;
    }

    const repoMeta = getRepositoryMeta(tool.source);
    let repositoryData = null;
    if (repoMeta) {
        repositoryData = await getGithubStats(
            toolId,
            repoMeta.owner,
            repoMeta.repo,
        );
    }

    const stars = await getRepoStarRecords(toolId);

    tool = {
        ...tool,
        ...(repositoryData ? { repositoryData: repositoryData } : {}),
        ...(stars ? { stars: stars } : {}),
    };

    return tool as Tool;
};

// Check if there is an icon for the tool
export const getToolIcon = (toolId: string) => {
    // get the absolute path to the icon from project root
    const path = `${process.cwd()}/public/assets/images/tools/${toolId}.png`;
    if (fs.existsSync(path)) {
        // Return web-accessible path
        return `/assets/images/tools/${toolId}.png`;
    } else {
        return null;
    }
};
