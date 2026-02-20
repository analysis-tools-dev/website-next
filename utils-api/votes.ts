import { VoteAction, calculateUpvotePercentage } from 'utils/votes';

import { createHash } from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { initFirebase } from './firebase';
import { isVotesApiData } from 'utils/type-guards';

export const PREFIX = 'toolsyaml';

export interface VotesData {
    votes: number;
    upVotes: number;
    downVotes: number;
    upvotePercentage: number;
}

export interface Vote {
    type: VoteType;
    date: Date;
    ip: string;
}

export enum VoteType {
    Up = 'UP',
    Down = 'DOWN',
}

export interface VoteAPIResponse {
    id: string;
    date: Date;
    vote: string | string[];
}

// Get a list of votes from firestore
// Cache votes data in memory with 5 minute expiry
let votesCache: {
    data: Record<string, any>;
    timestamp: number;
} | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

export const getDBVotes = async () => {
    try {
        // Return cached data if available and not expired
        if (votesCache && Date.now() - votesCache.timestamp < CACHE_TTL) {
            return votesCache.data;
        }

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

        // Update cache
        votesCache = {
            data: voteList,
            timestamp: Date.now(),
        };

        return voteList;
    } catch (e) {
        console.error(e);
        return {};
    }
};
// Cache tool votes data in memory with 30 minute expiry
const toolVotesCache: {
    [key: string]: {
        data: {
            id: string;
            sum: number;
            upVotes: number;
            downVotes: number;
        };
        timestamp: number;
    };
} = {};

export const getDBToolVotes = async (toolId: string) => {
    try {
        const key = `${PREFIX}${toolId}`;

        // Return cached data if available and not expired
        if (
            toolVotesCache[key] &&
            Date.now() - toolVotesCache[key].timestamp < CACHE_TTL
        ) {
            return toolVotesCache[key].data;
        }

        // Check if firebase already initialized
        initFirebase();
        const db = getFirestore();
        const toolVotesDoc = db.collection('tags').doc(key);
        const voteDoc = await toolVotesDoc.get();
        const voteData = voteDoc.data();

        const data = {
            id: voteDoc.id,
            sum: voteData?.sum || 0,
            upVotes: voteData?.upVotes || 0,
            downVotes: voteData?.downVotes || 0,
        };

        // Update cache
        toolVotesCache[key] = {
            data,
            timestamp: Date.now(),
        };

        return data;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export async function getVotes() {
    try {
        const data = await getDBVotes();
        if (!isVotesApiData(data)) {
            console.error('Votes TypeError');
            return null;
        }
        return data;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const getToolVotes = async (toolId: string): Promise<VotesData> => {
    try {
        const data = await getDBToolVotes(toolId);
        // TODO: Add typeguard
        if (!data) {
            console.error('Votes TypeError');
            return {
                votes: 0,
                upVotes: 0,
                downVotes: 0,
                upvotePercentage: 0,
            };
        }
        const upVotes = Number(data.upVotes || 0);
        const downVotes = Number(data.downVotes || 0);
        return {
            votes: Number(data.sum) || 0,
            upVotes,
            downVotes,
            upvotePercentage: calculateUpvotePercentage(upVotes, downVotes),
        };
    } catch (e) {
        console.error(e);
        return {
            votes: 0,
            upVotes: 0,
            downVotes: 0,
            upvotePercentage: 0,
        };
    }
};

export const publishVote = async (
    toolId: string,
    ip: string,
    vote: VoteAction,
) => {
    const key = `${PREFIX}${toolId}`;

    try {
        // Check if firebase already initialized
        initFirebase();
        const db = getFirestore();
        const toolVotesDoc = db.collection('tags').doc(key);

        const hashedIP = hashIP(ip);
        return await toolVotesDoc
            .collection('votes')
            .doc(hashedIP)
            .set({
                date: new Date(),
                ip: hashedIP,
                type: vote === 1 ? VoteType.Up : VoteType.Down,
            });
    } catch (e) {
        console.error(e);
    }
};

export const recalculateToolVotes = async (toolId: string) => {
    const key = `${PREFIX}${toolId}`;

    let upVotes = 0;
    let downVotes = 0;

    try {
        // Check if firebase already initialized
        initFirebase();
        const db = getFirestore();
        const toolVotesDoc = db.collection('tags').doc(key);

        const allVotesSnapshot = await toolVotesDoc.collection('votes').get();
        allVotesSnapshot.forEach((voteDoc) => {
            const v = voteDoc.data() as Vote;
            switch (v.type) {
                case VoteType.Up:
                    upVotes++;
                    break;
                case VoteType.Down:
                    downVotes++;
                    break;

                default:
                    throw new Error(`Unknown vote type ${v.type}`);
            }
        });
        await toolVotesDoc.set({
            upVotes,
            downVotes,
            sum: upVotes - downVotes,
        });
    } catch (e) {
        console.error(e);
    }
};

export const hashIP = (ip: string) => {
    const salt = process.env.GH_TOKEN;
    return createHash('md5')
        .update(salt + ip)
        .digest('hex');
};
