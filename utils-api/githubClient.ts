import { Octokit } from '@octokit/core';
import { throttling } from '@octokit/plugin-throttling';

// Create a throttled Octokit instance that can be used to make requests
// to the GitHub API. The Octokit instance is configured with the
// `throttling` plugin to automatically retry requests when the API
// rate limit is reached.
const ThrottledOctokit = Octokit.plugin(throttling);

// Function to create a throttled Octokit instance
export const createThrottledOctokit = () => {
    return new ThrottledOctokit({
        auth: process.env.GH_TOKEN,
        userAgent: 'analysis-tools (https://github.com/analysis-tools-dev)',
        throttle: {
            onRateLimit: (retryAfter: number, options: any) => {
                console.warn(
                    `Request quota exhausted for request ${options.method} ${options.url}`,
                );

                // Retry twice after hitting a rate limit error, then give up
                if (options.request.retryCount < 1) {
                    console.log(`Retrying after ${retryAfter} seconds!`);
                    return true;
                }
            },
            onSecondaryRateLimit: (
                retryAfter: number,
                options: any,
                octokit: Octokit,
            ) => {
                // does not retry, only logs a warning
                octokit.log.warn(
                    `SecondaryRateLimit detected for request ${options.method} ${options.url}`,
                );
            },
            onAbuseLimit: (retryAfter: number, options: any) => {
                // does not retry, only logs a warning
                console.warn(
                    `Abuse detected for request ${options.method} ${options.url}`,
                );
            },
        },
    });
};
