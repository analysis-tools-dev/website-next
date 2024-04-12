import type { NextApiRequest, NextApiResponse } from 'next';
import { getToolsWithVotes } from 'utils-api/toolsWithVotes';
import { filterResults } from 'utils-api/filters';
import { type Tool } from '@components/tools/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Tool[] | { error: string }>,
) {
    const tools = await getToolsWithVotes();

    if (!tools) {
        res.status(500).json({ error: 'Failed to load data' });
        return res;
    }

    const filteredData = filterResults(tools, req.query);
    res.status(200).json(filteredData);
}
