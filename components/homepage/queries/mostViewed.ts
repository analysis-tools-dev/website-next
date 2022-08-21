import { QueryClient, useQuery } from 'react-query';
import { APIPaths, getApiURL } from 'utils/urls';
import { type Tool } from '@components/tools';

/**
 * Query key used for caching
 *
 * @see https://react-query.tanstack.com/guides/query-keys
 */
export const MOST_VIEWED_PREFETCH_KEY = 'mostViewed';

/**
 * Prepare and prefetch data on server-side, to be ready on client page render
 * @desc Only usable SERVERSIDE!
 * @param {QueryClient} queryClient - React-Query client object
 *
 * @see https://react-query.tanstack.com/guides/prefetching#_top
 */
export async function prefetchMostViewed(queryClient: QueryClient) {
    return await queryClient.prefetchQuery(
        MOST_VIEWED_PREFETCH_KEY,
        fetchMostViewed,
    );
}

/**
 * Fetches data from API using `useQuery` (react-query) or cache/prefetch data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useMostViewedQuery() {
    return useQuery(MOST_VIEWED_PREFETCH_KEY, fetchMostViewed);
}

/**
 * Return count of data fetched from API using `useQuery` (react-query) or cache/prefetch data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useMostViewedQueryCount() {
    return useQuery(MOST_VIEWED_PREFETCH_KEY, fetchMostViewed, {
        select: (tools) => tools.length,
    });
}

/**
 * Call API and return Promise to resolve `JSON` response
 * @desc Used as needed by `react-query` functions
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function fetchMostViewed(): Promise<Tool[]> {
    const apiURL = getApiURL(APIPaths.MOST_VIEWED);
    return fetch(apiURL).then((response) => response.json());
}
