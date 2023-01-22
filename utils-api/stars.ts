import { RepoStarsData } from '@components/tools';
import { useQuery } from 'react-query';
import { getRepoStarRecords } from 'utils/stars';
import { RepositoryMeta } from 'utils/types';

/**
 * Fetches data from API using `useQuery` (react-query) or cache/prefetch data if it exists
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function useStarsQuery(repoMeta: RepositoryMeta) {
    return useQuery<RepoStarsData[]>(`stars-${repoMeta.repo}`, () =>
        fetchToolStars(repoMeta),
    );
}

/**
 * Call API and return Promise to resolve `JSON` response
 * @desc Used as needed by `react-query` functions
 *
 * @see https://react-query.tanstack.com/guides/queries
 */
export function fetchToolStars(
    repoMeta: RepositoryMeta,
): Promise<RepoStarsData[]> {
    return getRepoStarRecords(
        `${repoMeta.owner}/${repoMeta.repo}`,
        process.env.GH_TOKEN || '',
        10,
    ).then((response) => response);
}
