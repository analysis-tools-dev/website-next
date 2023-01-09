/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Increase the timeout for static page generation
    // because the default is 60 seconds and it's not enough
    // because we are making a lot of requests to the GitHub API
    // and trigger the rate limit easily, so we need to throttle
    // the requests.
    // Rate limit can be up to 5 minutes at a time:
    // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting
    // so set the timeout to 30 minutes.
    staticPageGenerationTimeout: 30 * 60 * 1000,
    publicRuntimeConfig: {
        // Will be available on both server and client
        publicHost: process.env.NEXT_PUBLIC_HOST,
    },
    images: {
        domains: ['raw.githubusercontent.com'],
    },
};

module.exports = nextConfig;
