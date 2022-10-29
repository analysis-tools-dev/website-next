import type { NextApiRequest, NextApiResponse } from 'next';
import { initFirebase } from 'utils-api/firebase';
import { getVotes } from 'utils-api/votes';

import cacheManager from 'cache-manager';
import fsStore from 'cache-manager-fs-hash';

const cacheData = cacheManager.caching({
    store: fsStore,
    options: {
        path: 'diskcache', //path for cached files
        ttl: 60 * 60 * 24, //time to life in seconds
        subdirs: false, //create subdirectories
        zip: false, //zip files to save diskspace (default: false)
    },
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | { error: string }>,
) {
    const { toolId } = req.query;

    if (!toolId) {
        res.status(500);
        return res;
    }

    // Check if firebase already initialized
    initFirebase();

    const cacheKey = `vote_data`;
    try {
        // Get tool data from cache
        let data: any = await cacheData.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exist - calling API`,
            );
            data = await getVotes();
            if (data) {
                await cacheData.set(cacheKey, data, 30);
            }
        }

        const key = `toolsyaml${toolId.toString()}`;
        const votes = data[key];
        if (!votes) {
            res.status(404).json({
                error: `Could not find votes for tool: ${toolId.toString()}`,
            });
            return res;
        }
        res.status(200).json(votes);
        return res;
    } catch (e) {
        console.log(e);
        // console.log('Error occurred: ', JSON.stringify(e));
        res.status(500).json({ error: 'Failed to load data' });
        return res;
    }
}