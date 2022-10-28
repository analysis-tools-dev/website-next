import { type QueryClient, useQuery } from 'react-query';
import { type Article } from 'utils/types';
import { APIPaths, getApiURL } from 'utils/urls';

/**
 * Query key used for caching
 *
 * @see https://react-query.tanstack.com/guides/query-keys
 */
export const ARTICLES_PREFETCH_KEY = 'articles';

/**
 * Prepare and prefetch data on server-side, to be ready on client page render
 * @desc Only usable SERVERSIDE!
 * @param {QueryClient} queryClient - React-Query client object
 *
 * @see https://react-query.tanstack.com/guides/prefetching#_top
 */
export async function prefetchArticles(queryClient: QueryClient) {
    return await queryClient.prefetchQuery(
        ARTICLES_PREFETCH_KEY,
        fetchArticles,
    );
}

/**
 * Fetches data from API using `useQuery` (react-query) or cache/prefetch data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useArticlesQuery() {
    return useQuery(ARTICLES_PREFETCH_KEY, fetchArticles);
}

/**
 * Return count of data fetched from API using `useQuery` (react-query) or cache/prefetch data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useArticleQueryCount() {
    return useQuery(ARTICLES_PREFETCH_KEY, fetchArticles, {
        select: (articles) => articles.length,
    });
}

/**
 * Call API and return Promise to resolve `JSON` response
 * @desc Used as needed by `react-query` functions
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export async function fetchArticles(): Promise<Article[]> {
    const articlesApiURL = getApiURL(APIPaths.BLOG);
    const response = await fetch(articlesApiURL);
    return await response.json();
}
