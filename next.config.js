/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        // Will be available on both server and client
        publicHost: process.env.NEXT_PUBLIC_HOST,
    },
    images: {
        domains: ['raw.githubusercontent.com'],
    },
};

module.exports = nextConfig;
