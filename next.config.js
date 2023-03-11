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
    images: {
        domains: ['raw.githubusercontent.com'],
    },
};
