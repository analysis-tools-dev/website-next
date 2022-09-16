import { RepositoryData } from '@components/tools/types';
import { Octokit } from '@octokit/core';

import cacheManager from 'cache-manager';
import fsStore from 'cache-manager-fs-hash';
import base64 from 'base-64';
import utf8 from 'utf8';
import { getMarkdownSection } from './markdown';

const cacheData = cacheManager.caching({
    store: fsStore,
    options: {
        path: 'diskcache', //path for cached files
        ttl: 60 * 60 * 24, //time to life in seconds
        subdirs: false, //create subdirectories
        zip: false, //zip files to save diskspace (default: false)
    },
});

const getReadme = async (owner: string, repo: string): Promise<string> => {
    console.log('getReadme', owner, repo);
    const readme = await cacheData.wrap(
        `${owner}/${repo}/readme`,
        async () => {
            const octokit = new Octokit();
            const readme = await octokit.request(
                'GET /repos/{owner}/{repo}/readme',
                {
                    owner,
                    repo,
                },
            );
            return readme;
        },
        { ttl: 60 * 60 * 24 },
    );
    console.log(readme);

    const readmeContent = base64.decode(readme.data.content);
    const decodedReadme = utf8.decode(readmeContent);
    return decodedReadme;
};

const getUsageInstructions = async (
    owner: string,
    repo: string,
): Promise<string | null> => {
    console.log('getUsageInstructions', owner, repo);
    const readme = await getReadme(owner, repo);
    const usageInstructions = await getMarkdownSection(readme, 'Documentation');
    return usageInstructions;
};

export const getGithubStats = async (
    toolId: string,
    owner: string,
    repo: string,
): Promise<RepositoryData | null> => {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
        asdf: 'asdf',
    });

    const cacheKey = `${toolId}_github_data`;

    try {
        // Get tool data from cache
        let data: RepositoryData | undefined = await cacheData.get(cacheKey);
        if (!owner || !repo) {
            return null;
        }
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exist - calling API`,
            );
            // Call API and refresh cache
            const response = await octokit.request(
                'GET /repos/{owner}/{repo}',
                {
                    owner,
                    repo,
                },
            );
            if (response.data) {
                data = {
                    source: response.data.html_url,
                    name: response.data.name,
                    stars: response.data.stargazers_count,
                    issues: response.data.open_issues,
                    forks: response.data.forks,
                    created: response.data.created_at,
                    updated: response.data.updated_at,
                    instructions: await getUsageInstructions(owner, repo),
                };
                const hours = Number(process.env.API_CACHE_TTL) || 24;
                await cacheData.set(cacheKey, data, hours * 60 * 60);
            } else {
                console.error(`Could not find stats for tool: ${toolId}`);
                return null;
            }
        }
        return data;
    } catch (e) {
        console.error(e);
        return null;
    }
};
