import { QueryClient, useQuery } from 'react-query';
import { type SearchState } from 'context/SearchProvider';
import { type ParsedUrlQuery } from 'querystring';
import { getToolsApiURL } from 'utils/urls';
import { Tool } from '../types';

/**
 * Query key used for caching
 *
 * @see https://react-query.tanstack.com/guides/query-keys
 */
export const TOOLS_PREFETCH_KEY = 'tools';
export const ALTERNATE_TOOLS_PREFETCH_KEY = 'alternate-tools';

/**
 * Prepare and prefetch data on server-side, to be ready on client page render
 * @desc Only usable SERVERSIDE!
 * @param {QueryClient} queryClient - React-Query client object
 * @param {ParsedUrlQuery} query - Search terms and keywords to filter results
 *
 * @see https://react-query.tanstack.com/guides/prefetching#_top
 */
export async function prefetchTools(
    queryClient: QueryClient,
    query?: ParsedUrlQuery,
) {
    return await queryClient.prefetchQuery(TOOLS_PREFETCH_KEY, () =>
        fetchToolsDataFromQuery(query),
    );
}

/**
 * Fetches data from API using `useQuery` (react-query) or cache/prefetch data if it exists
 * @param {SearchState} search - Search terms and keywords to filter results
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useToolsQuery(search: SearchState) {
    // FIXME: Key should contain some SearchState data to avoid cache issues
    return useQuery(TOOLS_PREFETCH_KEY, () => fetchToolsDataFromSearch(search));
}

/**
 * Return count of data fetched from API using `useQuery` (react-query) or cache/prefetch data if it exists
 * @param {SearchState} search - Search terms and keywords to filter results
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useToolsQueryCount(search: SearchState) {
    return useQuery(
        TOOLS_PREFETCH_KEY,
        () => fetchToolsDataFromSearch(search),
        {
            select: (tools) => tools.length,
        },
    );
}

/**
 * Fetches data from API using `useQuery` (react-query) or cache/prefetch data if it exists
 * @param {SearchState} search - Search terms and keywords to filter results
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useAlternateToolsQuery(search: SearchState) {
    //TODO: Filter out current Tool
    // FIXME: Key should contain some SearchState data to avoid cache issues
    return useQuery(ALTERNATE_TOOLS_PREFETCH_KEY, () =>
        fetchToolsDataFromSearch(search),
    );
}

/**
 * Call API and return Promise to resolve `JSON` response
 * @desc Used as needed by `react-query` functions
 * @param {SearchState} search - Search terms and keywords to filter results
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function fetchToolsDataFromSearch(search: SearchState): Promise<Tool[]> {
    const toolsApiURL = getToolsApiURL(search);
    return fetch(toolsApiURL).then((response) => response.json());
}

/**
 * Call API and return Promise to resolve `JSON` response
 * @desc Used for prefetch on Tools page
 * @param {ParsedUrlQuery} query - Search terms and keywords to filter results
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function fetchToolsDataFromQuery(
    query?: ParsedUrlQuery,
): Promise<Tool[]> {
    const toolsApiURL = getToolsApiURL(query);
    return fetch(toolsApiURL).then((response) => response.json());
}
