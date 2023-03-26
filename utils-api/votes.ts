import { getFirestore } from 'firebase-admin/firestore';
import { initFirebase } from './firebase';
import { isVotesApiData } from 'utils/type-guards';
import { createHash } from 'crypto';

import { VoteAction } from 'utils/votes';

export const PREFIX = 'toolsyaml';

export interface Vote {
    type: VoteType;
    date: Date;
    ip: string;
}

export enum VoteType {
    Up = 'UP',
    Down = 'DOWN',
}

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
    const key = `${PREFIX}${toolId}`;

    // Check if firebase already initialized
    initFirebase();
    const db = getFirestore();
    const toolVotesDoc = db.collection('tags').doc(key);
    const voteDoc = await toolVotesDoc.get();
    const voteData = voteDoc.data();
    return {
        id: voteDoc.id,
        sum: voteData?.sum || 0,
        upVotes: voteData?.upVotes || 0,
        downVotes: voteData?.downVotes || 0,
    };
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

export const getToolVotes = async (toolId: string) => {
    try {
        const data = await getDBToolVotes(toolId);
        // TODO: Add typeguard
        if (!data) {
            console.error('Votes TypeError');
            return {
                votes: 0,
                upVotes: 0,
                downVotes: 0,
            };
        }
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
            downVotes: 0,
        };
    }
};

export const publishVote = async (
    toolId: string,
    ip: string,
    vote: VoteAction,
) => {
    const key = `${PREFIX}${toolId}`;

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
};

export const recalculateToolVotes = async (toolId: string) => {
    const key = `${PREFIX}${toolId}`;

    let upVotes = 0;
    let downVotes = 0;

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
};

export const hashIP = (ip: string) => {
    const salt = process.env.GH_TOKEN;
    return createHash('md5')
        .update(salt + ip)
        .digest('hex');
};
