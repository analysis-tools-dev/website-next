import cacheData from 'memory-cache';
import { getFirestore } from 'firebase-admin/firestore';
import { apps } from 'firebase-admin';
import { applicationDefault, initializeApp } from 'firebase-admin/app';

// Get a list of votes from firestore
export async function getDBVotes() {
    // Check if firebase already initialized
    if (!apps.length) {
        initializeApp({
            credential: applicationDefault(),
            databaseURL: 'https://analysis-tools-dev.firebaseio.com',
        });
    }
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

export async function getVotes() {
    const cacheKey = `votes_data`;
    try {
        // Get tool data from cache
        let data = cacheData.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exists - calling API`,
            );
            data = await getDBVotes();
            if (data) {
                cacheData.put(cacheKey, data, 1000 * 30);
            }
        }
        return data;
    } catch (e) {
        console.log(e);
        return {};
    }
}
