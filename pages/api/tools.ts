import type { NextApiRequest, NextApiResponse } from 'next';
import { getToolsWithVotes } from 'utils-api/toolsWithVotes';
import { filterResults } from 'utils-api/filters';
import { type Tool } from '@components/tools/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ data: Tool[]; error?: string }>,
) {
    try {
        const tools = await getToolsWithVotes();

        if (!tools) {
            console.error('ERROR: Failed to load tools with votes');
            res.status(500).json({ error: 'Failed to load data', data: [] });
            return;
        }

        const data = filterResults(tools, req.query);
        res.status(200).json({ data });
    } catch (error) {
        console.error('ERROR: An unexpected error occurred', error);
        res.status(500).json({
            error: 'An unexpected error occurred',
            data: [],
        });
    }
}
