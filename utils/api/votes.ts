import NodeCache from 'node-cache';
import { getFirestore } from 'firebase-admin/firestore';
import { initFirebase } from './firebase';

const cacheData = new NodeCache();

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
        let data: any = cacheData.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exists - calling API`,
            );
            data = await getDBVotes();
            if (data) {
                cacheData.set(cacheKey, data, 30);
            } else {
                console.error(`ERROR: Failed to load votes data`);
            }
        }
        // TODO: Add typeguard
        return data;
    } catch (e) {
        console.log(e);
        return {};
    }
}

export const getToolVotes = async (toolId: string) => {
    const cacheKey = `${toolId}_votes_data`;
    try {
        // Get tool data from cache
        let data: any = cacheData.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exists - calling API`,
            );
            data = await getDBToolVotes(toolId);
            if (data) {
                cacheData.set(cacheKey, data, 30);
            } else {
                console.error(`ERROR: Failed to load ${toolId} vote data`);
            }
        }
        // TODO: Add typeguard
        return Number(data.sum) || 0;
    } catch (e) {
        console.log(e);
        return 0;
    }
};
