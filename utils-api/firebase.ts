import { apps, credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

export const initFirebase = () => {
    // Check if firebase already initialized
    if (!apps.length) {
        initializeApp({
            credential: !!process.env.GOOGLE_APPLICATION_CREDENTIALS
                ? credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS)
                : undefined,

            databaseURL: 'https://analysis-tools-dev.firebaseio.com',
        });
    }
};
