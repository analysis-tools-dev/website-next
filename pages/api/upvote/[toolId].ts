import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { initFirebase } from 'utils-api/firebase';

import cacheManager from 'cache-manager';
import fsStore from 'cache-manager-fs-hash';

const cacheData = cacheManager.caching({
    store: fsStore,
    options: {
        path: '.cache', // path for cached files
        ttl: 60 * 60 * 24, // time to life in seconds
        subdirs: false, // create subdirectories
        zip: false, // zip files to save diskspace (default: false)
    },
});

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

const getVotesJson = async (toolId: string) => {
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
        // TODO: Add typeguard
        const key = `toolsyaml${toolId.toString()}`;
        const votes = data[key];
        if (!votes) {
            return null;
        }
        return votes;
    } catch (e) {
        console.log('Error occurred: ', JSON.stringify(e));
        return null;
    }
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | { error: string }>,
) {
    let { toolId } = req.query;
    // take first entry if toolId is an array
    if (Array.isArray(toolId)) {
        toolId = toolId[0];
    }

    if (!toolId) {
        res.status(500);
        return res;
    }

    // Check if firebase already initialized
    initFirebase();

    const votes = await getVotesJson(toolId);
    if (votes) {
        res.status(200).json(votes);
    } else {
        res.status(404).json({
            error: `Could not find votes for tool: ${toolId.toString()}`,
        });
    }
    return res;
}
