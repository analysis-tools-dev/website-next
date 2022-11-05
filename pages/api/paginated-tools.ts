import type { NextApiRequest, NextApiResponse } from 'next';
import { getToolsWithVotes } from 'utils-api/toolsWithVotes';
import { filterResults } from 'utils-api/filters';
import { type Tool } from '@components/tools/types';

interface PaginatedData {
    data: Tool[];
    nextCursor?: number;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PaginatedData | { error: string }>,
) {
    const data = await getToolsWithVotes();

    if (!data) {
        res.status(500).json({ error: 'Failed to load data' });
        return res;
    }

    const filteredData = filterResults(data, req.query);

    // Check if limit is set and is number
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    if (limit) {
        const startIndex = offset * limit;
        const endIndex = startIndex + limit;
        const data = filteredData.slice(startIndex, endIndex);
        const paginatedData = {
            data,
            nextCursor: data.length === limit ? offset + 1 : undefined,
        };
        // return only the first N results
        res.status(200).json(paginatedData);
        return res;
    }
    res.status(200).json({ data: filteredData });
    return res;
}
