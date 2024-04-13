import { QueryClient, useQuery } from 'react-query';
import { VotesData } from 'utils-api/votes';
import { APIResponseType } from 'utils/types';
import { APIPaths, getApiURL } from 'utils/urls';

/**
 * Prepare and prefetch data on server-side, to be ready on client page render
 * @desc Only usable SERVERSIDE!
 * @param {QueryClient} queryClient - React-Query client object
 * @param {string} toolId - Tool ID used to fetch data
 *
 * @see https://react-query.tanstack.com/guides/prefetching#_top
 */
export async function prefetchToolVotes(
    queryClient: QueryClient,
    toolId: string,
) {
    return await queryClient.prefetchQuery(`votes-${toolId}`, () =>
        fetchToolVotesData(toolId),
    );
}

/**
 * Fetches data from API using `useQuery` (react-query) or cache/prefetch data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useToolVotesQuery(toolId: string) {
    return useQuery(`votes-${toolId}`, () => fetchToolVotesData(toolId));
}

/**
 * Call API and return Promise to resolve `JSON` response
 * @desc Used as needed by `react-query` functions
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export async function fetchToolVotesData(
    toolId: string,
): Promise<APIResponseType<VotesData | null>> {
    try {
        const voteApiURL = `${getApiURL(APIPaths.VOTES)}/${toolId}`;
        const response = await fetch(voteApiURL);
        return await response.json();
    } catch (error) {
        return {
            error: 'An error occurred fetching votes.',
            data: null,
        };
    }
}
