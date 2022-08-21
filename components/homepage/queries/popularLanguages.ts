import { type QueryClient, useQuery } from 'react-query';
import { APIPaths, getApiURL } from 'utils/urls';
import { type ToolsByLanguage } from '@components/tools';

/**
 * Query key used for caching
 *
 * @see https://react-query.tanstack.com/guides/query-keys
 */
export const POPULAR_LANGUAGES_PREFETCH_KEY = 'popularLanguages';

/**
 * Prepare and prefetch data on server-side, to be ready on client page render
 * @desc Only usable SERVERSIDE!
 * @param {QueryClient} queryClient - React-Query client object
 *
 * @see https://react-query.tanstack.com/guides/prefetching#_top
 */
export async function prefetchPopularLanguages(queryClient: QueryClient) {
    return await queryClient.prefetchQuery(
        POPULAR_LANGUAGES_PREFETCH_KEY,
        fetchPopularLanguages,
    );
}

/**
 * Fetches data from API using `useQuery` (react-query) or cache/prefetch data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function usePopularLanguagesQuery() {
    return useQuery(POPULAR_LANGUAGES_PREFETCH_KEY, fetchPopularLanguages);
}

/**
 * Return count of data fetched from API using `useQuery` (react-query) or cache/prefetch data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function usePopularLanguagesQueryCount() {
    return useQuery(POPULAR_LANGUAGES_PREFETCH_KEY, fetchPopularLanguages, {
        select: (languages) => Object.keys(languages).length,
    });
}

/**
 * Call API and return Promise to resolve `JSON` response
 * @desc Used as needed by `react-query` functions
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function fetchPopularLanguages(): Promise<ToolsByLanguage> {
    const apiURL = getApiURL(APIPaths.POPULAR_LANGUAGES);
    return fetch(apiURL).then((response) => response.json());
}
