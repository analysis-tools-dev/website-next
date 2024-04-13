import type { NextApiRequest, NextApiResponse } from 'next';
import { VotesData, getToolVotes } from 'utils-api/votes';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ data: VotesData | null; error?: string }>,
) {
    const { toolId } = req.query;

    if (!toolId) {
        res.status(500).json({ error: 'Failed to votes data', data: null });
        return res;
    }

    const data = await getToolVotes(toolId.toString());
    if (!data) {
        console.error(`ERROR: Failed to load ${toolId} vote data`);
        res.status(500).json({ error: 'Failed to load vote data', data: null });
        return res;
    }

    res.status(200).json({ data });
    return res;
}
