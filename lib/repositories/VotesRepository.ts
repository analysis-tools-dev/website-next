/**
 * VotesRepository
 *
 * Repository class for accessing votes data from Firebase.
 * Provides a simplified interface for fetching votes at build time.
 */

import type { VotesApiData } from 'utils/types';
import fs from 'fs';

export class VotesRepository {
    private static instance: VotesRepository | null = null;
    private initPromise: Promise<void> | null = null;
    private votesCache: VotesApiData | null = null;
    private credentialsValidated = false;

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

    /**
     * Checks if Firebase credentials environment variable is set.
     * Returns false if not configured (graceful skip).
     * Throws an error if configured but invalid (fail fast).
     */
    isConfigured(): boolean {
        const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

        // If env var is not set, gracefully skip (not an error)
        if (!credentialsPath) {
            return false;
        }

        // If already validated, return true
        if (this.credentialsValidated) {
            return true;
        }

        // Env var is set, so credentials MUST be valid - fail fast if not

        // Check if file exists
        if (!fs.existsSync(credentialsPath)) {
            throw new Error(
                `Firebase credentials file not found at: ${credentialsPath}. ` +
                    `Either unset GOOGLE_APPLICATION_CREDENTIALS or provide a valid credentials file.`,
            );
        }

        // Check if file contains valid JSON with required fields
        let credentials: Record<string, unknown>;
        try {
            const fileContent = fs.readFileSync(credentialsPath, 'utf-8');
            credentials = JSON.parse(fileContent);
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new Error(
                    `Firebase credentials file contains invalid JSON: ${credentialsPath}`,
                );
            }
            throw new Error(
                `Error reading Firebase credentials file: ${credentialsPath} - ${error}`,
            );
        }

        // Check for required fields in a service account key file
        const requiredFields = [
            'type',
            'project_id',
            'private_key_id',
            'private_key',
            'client_email',
        ];
        const missingFields = requiredFields.filter(
            (field) => !credentials[field],
        );

        if (missingFields.length > 0) {
            throw new Error(
                `Firebase credentials file is missing required fields: ${missingFields.join(
                    ', ',
                )}. ` + `File: ${credentialsPath}`,
            );
        }

        this.credentialsValidated = true;
        return true;
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
    }

    clearCache(): void {
        this.votesCache = null;
        this.credentialsValidated = false;
    }
}
