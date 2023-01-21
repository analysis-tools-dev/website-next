import { existsSync, readFileSync } from 'fs';
import { Octokit } from '@octokit/core';
import { isLanguageData, isTagsApiData, isTagsType } from 'utils/type-guards';
import { TagsType } from 'utils/types';
import { getCacheManager } from './cache';
import { join } from 'path';

/**
 * Local file path for language tag data files
 */
export const LANGUAGE_DATA_PATH = join(
    process.cwd(),
    'data',
    'descriptions.json',
);

const cacheDataManager = getCacheManager();

export const getTags = async (type: TagsType) => {
    if (!isTagsType(type)) {
        console.error(`Could not load ${type} tags`);
        return null;
    }

    const octokit = new Octokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
    });

    const cacheKey = `tags_${type}`;

    try {
        // Get tool data from cache
        let data = await cacheDataManager.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exist - calling API`,
            );
            // Call API and refresh cache
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
                const hours = Number(process.env.API_CACHE_TTL) || 24;
                await cacheDataManager.set(cacheKey, data, hours * 60 * 60);
            }
        }

        if (!isTagsApiData(data)) {
            console.error('Failed to load tags data');
            await cacheDataManager.del(cacheKey);
            return null;
        }

        if (type === 'all') {
            // Deconstruct the data object into an array of tags
            const allTags = Object.values(data).reduce(
                (acc, curr) => [...acc, ...curr],
                [],
            );
            return allTags;
        }

        const requestedTags = data[type];
        if (!requestedTags) {
            console.error(`Could not load ${type} tags`);
            return null;
        }

        return requestedTags;
    } catch (e) {
        console.error('Error occurred: ', JSON.stringify(e));
        await cacheDataManager.del(cacheKey);
        return null;
    }
};

export const getTag = async (type: TagsType, tagId: string) => {
    if (!isTagsType(type)) {
        console.error(`Could not load ${type} tags`);
        return null;
    }

    try {
        const tags = await getTags(type);
        if (!tags) {
            console.error(`Could not load ${type} tags`);
            return null;
        }

        const tag = tags.find(
            (t) => t.tag.toLowerCase() === tagId.toLowerCase(),
        );
        if (!tag) {
            console.error(`Could not load ${type} tag: ${tagId}`);
            return null;
        }

        return tag;
    } catch (e) {
        console.error('Error occurred: ', JSON.stringify(e));
        return null;
    }
};

export const getLanguageData = async (tagId: string) => {
    const languageFilePath = LANGUAGE_DATA_PATH;
    const defaultTagData = {
        // capitalize first letter
        tag: tagId.charAt(0).toUpperCase() + tagId.slice(1),
        website: '',
        description: '',
    };

    try {
        if (!existsSync(languageFilePath)) {
            return defaultTagData;
        }
        const fileContents = readFileSync(languageFilePath);
        const data = JSON.parse(fileContents.toString());
        if (!data || !data[tagId] || !isLanguageData(data[tagId])) {
            return defaultTagData;
        }

        return data[tagId];
    } catch (e) {
        console.error('Error occurred: ', JSON.stringify(e));
        return defaultTagData;
    }
};
