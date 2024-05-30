import type { NextApiRequest, NextApiResponse } from 'next';
import { VotesData, getToolVotes } from 'utils-api/votes';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ data: VotesData | null; error?: string }>,
) {
    try {
        const { toolId } = req.query;

        if (!toolId || typeof toolId !== 'string') {
            res.status(400).json({
                error: 'Tool ID is required and must be a string',
                data: null,
            });
            return;
        }

        const data = await getToolVotes(toolId);

        if (!data) {
            console.error(`ERROR: Failed to load ${toolId} vote data`);
            res.status(500).json({
                error: 'Failed to load vote data',
                data: null,
            });
            return;
        }

        res.status(200).json({ data });
    } catch (error) {
        console.error('ERROR: An unexpected error occurred', error);
        res.status(500).json({
            error: 'An unexpected error occurred',
            data: null,
        });
    }
}
