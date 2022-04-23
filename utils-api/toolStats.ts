import NodeCache from 'node-cache';
import { Octokit } from '@octokit/core';
import { ToolsByLanguage } from '@components/tools';

const cacheData = new NodeCache();

export async function getStats(file: string) {
    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    const cacheKey = `${file}_stats`;
    try {
        let data: any = cacheData.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exists - calling API`,
            );
            // Call API and refresh cache
            const response = await octokit.request(
                'GET /repos/{owner}/{repo}/contents/data/api/stats/{file}.json',
                {
                    owner: 'analysis-tools-dev',
                    repo: 'static-analysis',
                    file,
                    headers: {
                        accept: 'application/vnd.github.VERSION.raw',
                    },
                },
            );
            data = JSON.parse(response.data.toString());
            if (data) {
                const hours = Number(process.env.API_CACHE_TTL) || 24;
                cacheData.set(cacheKey, data, hours * 60 * 60);
            }
        }
        // TODO: Add typeguard
        return data || null;
    } catch (e) {
        console.error('Error occurred: ', JSON.stringify(e));
        cacheData.del(cacheKey);
        return null;
    }
}

export async function getToolStats() {
    return await getStats('tools');
}

export async function getLanguageStats() {
    const stats = await getStats('tags');
    const languages: ToolsByLanguage = {};
    Object.keys(stats).forEach((key) => {
        const language = key.split('/tag/').join('');
        languages[language] = {
            views: stats[key],
            tools: [],
        };
    });

    return languages;
}
