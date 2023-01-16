import { apps, credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

export const initFirebase = () => {
    // Check if firebase already initialized
    if (!apps.length) {
        initializeApp({
            credential: credential.applicationDefault(),
            databaseURL: 'https://analysis-tools-dev.firebaseio.com',
        });
    }
};
