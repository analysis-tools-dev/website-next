import { useMemo } from 'react';
import useSWR from 'swr';

export const useGetToolVotes = (toolId: string) => {
    const fetcher = (...args: any) => fetch(args).then((res) => res.json());

    const { data, error } = useSWR(`/api/votes/${toolId}`, fetcher);

    return useMemo(() => {
        if (error) {
            return { downVotes: 0, sum: 0, upVotes: 0 };
        }
        return data;
    }, [data, error]);
};
