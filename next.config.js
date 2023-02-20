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
        publicHost: process.env.NEXT_PUBLIC_HOST,
    },
    images: {
        domains: ['raw.githubusercontent.com'],
        unoptimized: true,
    },
};
