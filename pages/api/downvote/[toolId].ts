import type { NextApiRequest, NextApiResponse } from 'next';
import NodeCache from 'node-cache';
import { initFirebase } from 'utils-api/firebase';
import { getVotes } from 'utils-api/votes';

const cacheData = new NodeCache();

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
        let data: any = cacheData.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exist - calling API`,
            );
            data = await getVotes();
            if (data) {
                cacheData.set(cacheKey, data, 30);
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
