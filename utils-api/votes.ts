import { getFirestore } from 'firebase-admin/firestore';
import { initFirebase } from './firebase';
import { isVotesApiData } from 'utils/type-guards';

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

// Get a list of votes from firestore
export const getDBVotes = async () => {
    // Check if firebase already initialized
    initFirebase();
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
};

export const getDBToolVotes = async (toolId: string) => {
    const key = `toolsyaml${toolId}`;

    // Check if firebase already initialized
    initFirebase();
    const db = getFirestore();
    const toolVotesDoc = db.collection('tags').doc(key);
    const voteData = await toolVotesDoc.get();
    return { id: voteData.id, ...voteData.data() };
};

export async function getVotes() {
    const cacheKey = `votes_data`;
    try {
        // Get tool data from cache
        let data: any = await cacheData.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exist - calling API`,
            );
            data = await getDBVotes();
            if (data) {
                await cacheData.set(cacheKey, data, 30);
            } else {
                console.error(`ERROR: Failed to load votes data`);
            }
        }
        if (!isVotesApiData(data)) {
            await cacheData.del(cacheKey);
            console.error('Votes TypeError');
            return null;
        }
        return data;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const getToolVotes = async (toolId: string) => {
    const cacheKey = `${toolId}_votes_data`;
    try {
        // Get tool data from cache
        let data: any = await cacheData.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exist - calling API`,
            );
            data = await getDBToolVotes(toolId);
            if (data) {
                await cacheData.set(cacheKey, data, 30);
            } else {
                console.error(`ERROR: Failed to load ${toolId} vote data`);
            }
        }
        // TODO: Add typeguard
        return {
            votes: Number(data.sum) || 0,
            upVotes: Number(data.upVotes || 0),
            downVotes: Number(data.downVotes || 0),
        };
    } catch (e) {
        console.error(e);
        return {
            votes: 0,
            upVotes: 0,
        };
    }
};
