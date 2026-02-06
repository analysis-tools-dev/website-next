/**
 * Firebase Votes Utility
 *
 * This module provides a simplified interface for reading votes from Firebase.
 * It's designed to be used at build time (getStaticProps) to fetch votes.
 *
 * For Phase 1, we keep Firebase for votes but simplify the interface.
 * In a future phase, votes could be migrated to Algolia or another service.
 */

import type { VotesApiData } from './types';

// Singleton promise for Firebase initialization
let firebaseInitPromise: Promise<void> | null = null;

/**
 * Initialize Firebase Admin SDK (singleton pattern)
 * This ensures Firebase is only initialized once, even with concurrent calls
 */
function initFirebase(): Promise<void> {
    if (firebaseInitPromise) {
        return firebaseInitPromise;
    }

    firebaseInitPromise = (async () => {
        // Dynamic import to avoid loading firebase-admin when not needed
        const { apps, credential } = await import('firebase-admin');
        const { initializeApp } = await import('firebase-admin/app');

        // Only initialize if no apps exist
        if (!apps.length) {
            initializeApp({
                credential: credential.applicationDefault(),
                databaseURL: 'https://analysis-tools-dev.firebaseio.com',
            });
        }
    })();

    return firebaseInitPromise;
}

/**
 * Fetch all votes from Firebase
 *
 * This function fetches all vote records from Firestore.
 * It should be called at build time (in getStaticProps) to get votes data.
 *
 * @returns VotesApiData object with vote counts per tool, or null on error
 */
export async function fetchVotes(): Promise<VotesApiData | null> {
    // Skip Firebase in environments without credentials
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.warn(
            'Firebase credentials not configured. Skipping votes fetch.',
        );
        return null;
    }

    try {
        await initFirebase();

        const { getFirestore } = await import('firebase-admin/firestore');
        const db = getFirestore();

        const votesCol = db.collection('tags');
        const voteSnapshot = await votesCol.get();

        const votes: VotesApiData = {};
        voteSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            votes[doc.id] = {
                sum: data.sum || 0,
                upVotes: data.upVotes || 0,
                downVotes: data.downVotes || 0,
            };
        });

        return votes;
    } catch (error) {
        console.error('Error fetching votes from Firebase:', error);
        return null;
    }
}

/**
 * Fetch votes for a single tool
 *
 * @param toolId - The tool ID to fetch votes for
 * @returns Vote data for the tool, or default values on error
 */
export async function fetchToolVotes(toolId: string): Promise<{
    votes: number;
    upVotes: number;
    downVotes: number;
}> {
    const defaultVotes = { votes: 0, upVotes: 0, downVotes: 0 };

    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        return defaultVotes;
    }

    try {
        await initFirebase();

        const { getFirestore } = await import('firebase-admin/firestore');
        const db = getFirestore();

        const key = `toolsyaml${toolId}`;
        const doc = await db.collection('tags').doc(key).get();

        if (!doc.exists) {
            return defaultVotes;
        }

        const data = doc.data();
        return {
            votes: data?.sum || 0,
            upVotes: data?.upVotes || 0,
            downVotes: data?.downVotes || 0,
        };
    } catch (error) {
        console.error(`Error fetching votes for tool ${toolId}:`, error);
        return defaultVotes;
    }
}

/**
 * Check if Firebase is configured
 */
export function isFirebaseConfigured(): boolean {
    return !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
}
