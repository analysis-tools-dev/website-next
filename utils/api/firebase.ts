import { apps, credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

export const initFirebase = () => {
    // Check if firebase already initialized
    if (!apps.length) {
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            initializeApp({
                credential: credential.cert(
                    process.env.GOOGLE_APPLICATION_CREDENTIALS,
                ),
                databaseURL: 'https://analysis-tools-dev.firebaseio.com',
            });
        } else {
            console.error(`Missing Google Credentials`);
        }
    }
};
