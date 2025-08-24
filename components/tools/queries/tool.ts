import { QueryClient, useQuery } from '@tanstack/react-query';
import { APIPaths, getApiURL } from 'utils/urls';
import { Tool } from '../types';
import { type APIResponseType } from 'utils/types';

/**
 * Prepare and prefetch data on server-side, to be ready on client page render
 * @desc Only usable SERVERSIDE!
 * @param {QueryClient} queryClient - React-Query client object
 * @param {string} slug - Tool ID used to fetch data
 *
 * @see https://react-query.tanstack.com/guides/prefetching#_top
 */
export async function prefetchTool(queryClient: QueryClient, slug: string) {
    return await queryClient.prefetchQuery({
        queryKey: [`tool-${slug}`],
        queryFn: () => fetchToolData(slug),
    });
}

/**
 * Fetches data from API using `useQuery` (react-query) or cache/prefetch data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useToolQuery(slug: string) {
    return useQuery({
        queryKey: [`tool-${slug}`],
        queryFn: () => fetchToolData(slug),
    });
}

/**
 * Call API and return Promise to resolve `JSON` response
 * @desc Used as needed by `react-query` functions
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export async function fetchToolData(
    slug: string,
): Promise<APIResponseType<Tool | null>> {
    try {
        const toolApiURL = `${getApiURL(APIPaths.TOOL)}/${slug}`;
        const response = await fetch(toolApiURL);
        return await response.json();
    } catch (error) {
        return {
            error: 'An error occurred fetching tool data.',
            data: null,
        };
    }
}
