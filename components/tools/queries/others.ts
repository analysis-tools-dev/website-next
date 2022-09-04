import { type QueryClient, useQuery } from 'react-query';
import { type ApiTag } from 'utils/types';
import { APIPaths, getApiURL } from 'utils/urls';

/**
 * Query key used for caching
 *
 * @see https://react-query.tanstack.com/guides/query-keys
 */
export const OTHERS_PREFETCH_KEY = 'others';

/**
 * Prepare and prefetch data on server-side, to be ready on client page render
 * @desc Only usable SERVERSIDE!
 * @param {QueryClient} queryClient - React-Query client object
 *
 * @see https://react-query.tanstack.com/guides/prefetching#_top
 */
export async function prefetchOthers(queryClient: QueryClient) {
    return await queryClient.prefetchQuery(OTHERS_PREFETCH_KEY, fetchOthers);
}

/**
 * Fetches data from API using `useQuery` (react-query) or cache/prefetch data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useOthersQuery() {
    return useQuery(OTHERS_PREFETCH_KEY, fetchOthers);
}

/**
 * Return count of data fetched from API using `useQuery` (react-query) or cache/prefetch data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useOtherQueryCount() {
    return useQuery(OTHERS_PREFETCH_KEY, fetchOthers, {
        select: (others) => others.length,
    });
}

/**
 * Call API and return Promise to resolve `JSON` response
 * @desc Used as needed by `react-query` functions
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function fetchOthers(): Promise<ApiTag[]> {
    const otherTagsApiURL = getApiURL(APIPaths.OTHER_TAGS);
    return fetch(otherTagsApiURL).then((response) => response.json());
}
