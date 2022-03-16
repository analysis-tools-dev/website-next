import { useMemo } from 'react';
import useSWR from 'swr';

export const useGetMostViewedTools = () => {
    const fetcher = (...args: any) => fetch(args).then((res) => res.json());

    const { data, error } = useSWR(`/api/mostViewed`, fetcher);

    return useMemo(() => {
        if (error) {
            return [];
        }
        return data;
    }, [data, error]);
};
