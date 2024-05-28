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
    try {
        const data = await getToolsWithVotes();

        if (!data) {
            console.error('ERROR: Failed to load data');
            res.status(500).json({ error: 'Failed to load data', data: null });
            return;
        }

        const filteredData = filterResults(data, req.query);
        let sortedTools: Tool[] = [];
        if (req.query.sorting) {
            sortedTools = filteredData.sort(
                pickSort(req.query.sorting.toString()),
            );
        } else {
            sortedTools = filteredData.sort(pickSort('votes_desc'));
        }

        // Check if limit is set and is a number
        const limit = Number(req.query.limit);
        const offset = Number(req.query.offset);

        if (limit && !isNaN(limit) && offset >= 0 && !isNaN(offset)) {
            const startIndex = offset * limit;
            const endIndex = startIndex + limit;
            const paginatedData: PaginatedData = {
                data: sortedTools.slice(startIndex, endIndex),
                nextCursor:
                    sortedTools.length > endIndex ? offset + 1 : undefined,
            };
            res.status(200).json({ data: paginatedData });
            return;
        }

        res.status(200).json({ data: { data: sortedTools } });
    } catch (error) {
        console.error('ERROR: An unexpected error occurred', error);
        res.status(500).json({
            error: 'An unexpected error occurred',
            data: null,
        });
    }
}
