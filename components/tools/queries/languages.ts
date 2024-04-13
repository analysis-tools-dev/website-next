import { type QueryClient, useQuery } from 'react-query';
import { type APIResponseType, type ApiTag } from 'utils/types';
import { APIPaths, getApiURL } from 'utils/urls';

/**
 * Query key used for caching
 *
 * @see https://react-query.tanstack.com/guides/query-keys
 */
export const LANGUAGES_PREFETCH_KEY = 'languages';

/**
 * Prepare and prefetch data on server-side, to be ready on client page render
 * @desc Only usable SERVERSIDE!
 * @param {QueryClient} queryClient - React-Query client object
 *
 * @see https://react-query.tanstack.com/guides/prefetching#_top
 */
export async function prefetchLanguages(queryClient: QueryClient) {
    return await queryClient.prefetchQuery(
        LANGUAGES_PREFETCH_KEY,
        fetchLanguages,
    );
}

/**
 * Fetches data from API using `useQuery` (react-query) or cache/prefetch data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useLanguagesQuery() {
    return useQuery(LANGUAGES_PREFETCH_KEY, fetchLanguages);
}

/**
 * Return count of data fetched from API using `useQuery` (react-query) or cache/prefetch data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useLanguageQueryCount() {
    return useQuery(LANGUAGES_PREFETCH_KEY, fetchLanguages, {
        select: ({ data }) => data.length,
    });
}

/**
 * Call API and return Promise to resolve `JSON` response
 * @desc Used as needed by `react-query` functions
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export async function fetchLanguages(): Promise<APIResponseType<ApiTag[]>> {
    try {
        const languageTagsApiURL = getApiURL(APIPaths.LANGUAGE_TAGS);
        const response = await fetch(languageTagsApiURL);
        return await response.json();
    } catch (error) {
        return {
            error: 'An error occurred fetching languages.',
            data: [],
        };
    }
}
