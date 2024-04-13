import type { NextApiRequest, NextApiResponse } from 'next';
import { getToolsWithVotes } from 'utils-api/toolsWithVotes';
import { filterResults } from 'utils-api/filters';
import { type Tool } from '@components/tools/types';
import { sortByPopularity } from 'utils/votes';

interface PaginatedData {
    data: Tool[];
    nextCursor?: number;
}

const pickSort = (sort: string) => {
    switch (sort) {
        case 'most_popular':
            return (a: Tool, b: Tool) => sortByPopularity(a, b);
        case 'least_popular':
            return (a: Tool, b: Tool) => sortByPopularity(b, a);
        case 'votes_asc':
            return (a: Tool, b: Tool) => a.votes - b.votes;
        case 'alphabetical_asc':
            return (a: Tool, b: Tool) => a.name.localeCompare(b.name);
        case 'alphabetical_desc':
            return (a: Tool, b: Tool) => b.name.localeCompare(a.name);
        default:
            return (a: Tool, b: Tool) => b.votes - a.votes;
    }
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ data: PaginatedData | null; error?: string }>,
) {
    const data = await getToolsWithVotes();

    if (!data) {
        res.status(500).json({ error: 'Failed to load data', data: null });
        return res;
    }

    const filteredData = filterResults(data, req.query);
    let sortedTools = [];
    if (req.query.sorting) {
        sortedTools = filteredData.sort(pickSort(req.query.sorting.toString()));
    } else {
        sortedTools = filteredData.sort(pickSort('votes_desc'));
    }

    // Check if limit is set and is number
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    if (limit) {
        const startIndex = offset * limit;
        const endIndex = startIndex + limit;
        const data = sortedTools.slice(startIndex, endIndex);
        const paginatedData = {
            data,
            nextCursor: data.length === limit ? offset + 1 : undefined,
        };
        // return only the first N results
        res.status(200).json({ data: paginatedData });
        return res;
    }
    res.status(200).json({ data: { data: sortedTools } });
    return res;
}
