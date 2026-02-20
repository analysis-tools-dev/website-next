/**
 * VotesRepository
 *
 * Repository class for accessing votes data from Firestore.
 * Uses Google Cloud Application Default Credentials.
 */

import type { VotesApiData } from 'utils/types';

export class VotesRepository {
    private static instance: VotesRepository | null = null;
    private votesCache: VotesApiData | null = null;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    static getInstance(): VotesRepository {
        if (!VotesRepository.instance) {
            VotesRepository.instance = new VotesRepository();
        }
        return VotesRepository.instance;
    }

    private isConfigured(): boolean {
        return !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }

    async fetchAll(): Promise<VotesApiData | null> {
        if (!this.isConfigured()) {
            return null;
        }

        if (this.votesCache) {
            return this.votesCache;
        }

        try {
            const { Firestore } = await import('@google-cloud/firestore');
            const db = new Firestore({ projectId: 'analysis-tools-dev' });

            const voteSnapshot = await db.collection('tags').get();

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
            console.error('Error fetching votes from Firestore:', error);
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
            const { Firestore } = await import('@google-cloud/firestore');
            const db = new Firestore({ projectId: 'analysis-tools-dev' });

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
