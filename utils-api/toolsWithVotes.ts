import { isToolsApiData } from 'utils/type-guards';
import { getCacheManager } from './cache';
import { getAllTools } from './tools';
import { getVotes } from './votes';

const cacheDataManager = getCacheManager();

export const getToolsWithVotes = async () => {
    const cacheKey = 'tools_votes_data';

    try {
        // Get data from cache
        const cacheResponse = await cacheDataManager.get(cacheKey);
        if (!cacheResponse) {
            console.log(
                `Cache data for: ${cacheKey} does not exist - calling API`,
            );
            // Call API and refresh cache
            const data = await getAllTools();
            const votes = await getVotes();

            if (!data || !votes) {
                console.error('Error loading tools with votes data');
                await cacheDataManager.del(cacheKey);
                return null;
            }
            Object.keys(data).forEach((toolId) => {
                const key = `toolsyaml${toolId.toString()}`;
                data[toolId].votes = votes[key]?.sum || 0;
                data[toolId].upVotes = votes[key]?.upVotes || 0;
                data[toolId].downVotes = votes[key]?.downVotes || 0;
            });

            const hours = Number(process.env.API_CACHE_TTL) || 24;
            await cacheDataManager.set(cacheKey, data, hours * 60 * 60);

            return data;
        }

        if (!isToolsApiData(cacheResponse)) {
            console.error('Error loading tools with votes data');
            await cacheDataManager.del(cacheKey);
            return null;
        }
        return cacheResponse;
    } catch (e) {
        console.error('Error occurred: ', JSON.stringify(e));
        await cacheDataManager.del(cacheKey);
        return null;
    }
};
