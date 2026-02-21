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
    env: {
        NEXT_PUBLIC_PUBLIC_HOST: process.env.PUBLIC_HOST,
        NEXT_PUBLIC_ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
        NEXT_PUBLIC_ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ik.imagekit.io',
            },
        ],
    },
};
