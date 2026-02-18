/**
 * VotesRepository
 *
 * Repository class for accessing votes data from Firebase.
 * Provides a simplified interface for fetching votes at build time.
 */

import type { VotesApiData } from 'utils/types';

export class VotesRepository {
    private static instance: VotesRepository | null = null;
    private initPromise: Promise<void> | null = null;
    private votesCache: VotesApiData | null = null;

    // Private constructor for singleton pattern
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    static getInstance(): VotesRepository {
        if (!VotesRepository.instance) {
            VotesRepository.instance = new VotesRepository();
        }
        return VotesRepository.instance;
    }

    private async initFirebase(): Promise<void> {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = (async () => {
            const { apps, credential } = await import('firebase-admin');
            const { initializeApp } = await import('firebase-admin/app');

            if (!apps.length) {
                initializeApp({
                    credential: credential.applicationDefault(),
                    databaseURL: 'https://analysis-tools-dev.firebaseio.com',
                });
            }
        })();

        return this.initPromise;
    }

    isConfigured(): boolean {
        return !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }

    async fetchAll(): Promise<VotesApiData | null> {
        if (!this.isConfigured()) {
            console.warn(
                'Firebase credentials not configured. Skipping votes fetch.',
            );
            return null;
        }

        if (this.votesCache) {
            return this.votesCache;
        }

        try {
            await this.initFirebase();

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

            this.votesCache = votes;
            return votes;
        } catch (error) {
            console.error('Error fetching votes from Firebase:', error);
            return null;
        }
    }

    async fetchForTool(toolId: string): Promise<{
        votes: number;
        upVotes: number;
        downVotes: number;
    }> {
        const defaultVotes = { votes: 0, upVotes: 0, downVotes: 0 };

        if (!this.isConfigured()) {
            return defaultVotes;
        }

        try {
            await this.initFirebase();

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

    clearCache(): void {
        this.votesCache = null;
    }
}
