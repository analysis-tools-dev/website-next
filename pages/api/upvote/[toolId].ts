import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import NodeCache from 'node-cache';
import { initFirebase } from 'utils/api';

const cacheData = new NodeCache();

// Get a list of votes from firestore
async function getVotes() {
    const db = getFirestore();
    const votesCol = db.collection('tags');
    const voteSnapshot = await votesCol.get();
    const voteList: Record<string, any> = {};
    voteSnapshot.docs.forEach((doc) => {
        voteList[doc.id] = {
            ...doc.data(),
        };
    });
    return voteList;
}

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
                `Cache data for: ${cacheKey} does not exists - calling API`,
            );
            data = await getVotes();
            if (data) {
                cacheData.set(cacheKey, data, 30);
            }
        }
        // TODO: Add typeguard
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
        // console.log('Error occured: ', JSON.stringify(e));
        res.status(500).json({ error: 'Failed to load data' });
        return res;
    }
}
