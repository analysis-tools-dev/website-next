/** @type {import('next').NextConfig} */
module.exports = {
    async redirects() {
        return [
            {
                source: '/compare',
                destination: '/tools',
                permanent: true,
            },
            {
                source: '/sponsor',
                destination: '/sponsors',
                permanent: true,
            },
        ];
    },
    reactStrictMode: true,
    publicRuntimeConfig: {
        // Will be available on both server and client
        publicHost: process.env.PUBLIC_HOST,
        algoliaAppId: process.env.ALGOLIA_APP_ID,
        algoliaApiKey: process.env.ALGOLIA_API_KEY,
    },
    images: {
        domains: ['ik.imagekit.io'],
    },
};
