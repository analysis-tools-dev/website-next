import type { NextApiRequest, NextApiResponse } from 'next';
import cacheData from 'memory-cache';
import { getVotes, initFirebase } from 'utils/api';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | { error: string }>,
) {
    const { toolId } = req.query;

    if (!toolId) {
        res.status(500).json({ error: 'Failed to votes data' });
        return res;
    }

    // Check if firebase already initialized
    initFirebase();

    const cacheKey = `vote_data`;
    try {
        // Get tool data from cache
        let data = cacheData.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exists - calling API`,
            );
            data = await getVotes();
            if (data) {
                cacheData.put(cacheKey, data, 1000 * 30);
            }
        }

        const key = `toolsyaml${toolId.toString()}`;
        const votes = data[key];
        if (!votes) {
            res.status(200).json({ downVotes: 0, sum: 0, upVotes: 0 });
            return res;
        }
        res.status(200).json(votes);
        return res;
    } catch (e) {
        console.log(e);
        // console.log('Error occured: ', JSON.stringify(e));
        res.status(500).json({ error: 'Failed to load votes data' });
        return res;
    }
}
