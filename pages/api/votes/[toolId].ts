import type { NextApiRequest, NextApiResponse } from 'next';
import { getToolVotes } from 'utils/api';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | { error: string }>,
) {
    const { toolId } = req.query;

    if (!toolId) {
        res.status(500).json({ error: 'Failed to votes data' });
        return res;
    }

    const data = await getToolVotes(toolId.toString());
    if (!data) {
        console.error(`ERROR: Failed to load ${toolId} vote data`);
        res.status(500).json({ error: 'Failed to load vote data' });
        return res;
    }

    res.status(200).json(data);
    return res;
}
