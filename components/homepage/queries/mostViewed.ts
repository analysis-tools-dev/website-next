import { useQuery } from 'react-query';
import { APIPaths, getApiURL } from 'utils/urls';
import { type Tool } from '@components/tools';

export function useMostViewedQuery() {
    return useQuery('mostViewed', fetchMostViewed);
}

export function useMostViewedQueryCount() {
    return useQuery('mostViewed', fetchMostViewed, {
        select: (tools) => tools.length,
    });
}

export function fetchMostViewed(): Promise<Tool[]> {
    const mostViewedApiURL = getApiURL(APIPaths.MOST_VIEWED);
    return fetch(mostViewedApiURL).then((response) => response.json());
}
