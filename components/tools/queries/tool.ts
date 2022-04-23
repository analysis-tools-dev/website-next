import { QueryClient, useQuery } from 'react-query';
import { APIPaths, getApiURL } from 'utils/urls';
import { Tool } from '../types';

/**
 * Prepare and prefetch data on server-side, to be ready on client page render
 * @desc Only usable SERVERSIDE!
 * @param {QueryClient} queryClient - React-Query client object
 * @param {string} slug - Tool ID used to fetch data
 *
 * @see https://react-query.tanstack.com/guides/prefetching#_top
 */
export async function prefetchTool(queryClient: QueryClient, slug: string) {
    return await queryClient.prefetchQuery(`tool-${slug}`, () =>
        fetchToolData(slug),
    );
}

/**
 * Fetches data from API using `useQuery` (react-query) or cache/prefecth data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useToolQuery(slug: string) {
    return useQuery(`tool-${slug}`, () => fetchToolData(slug));
}

/**
 * Call API and return Promise to resolve `JSON` response
 * @desc Used as needed by `react-query` functions
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function fetchToolData(slug: string): Promise<Tool> {
    const toolApiURL = `${getApiURL(APIPaths.TOOL)}/${slug}`;
    return fetch(toolApiURL).then((response) => response.json());
}
