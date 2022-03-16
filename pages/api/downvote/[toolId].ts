import type { NextApiRequest, NextApiResponse } from 'next';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { apps } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import cacheData from 'memory-cache';

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
    if (!apps.length) {
        initializeApp({
            credential: applicationDefault(),
            databaseURL: 'https://analysis-tools-dev.firebaseio.com',
        });
    }

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
