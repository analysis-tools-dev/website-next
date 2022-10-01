import type { NextApiRequest, NextApiResponse } from 'next';
import { type Tool } from '@components/tools/types';
import { getMostViewedTools } from 'utils-api/mostViewedTools';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Tool[] | { error: string }>,
) {
    const data = await getMostViewedTools();

    if (!data) {
        res.status(500).json({ error: 'Failed to load most viewed tool data' });
        return res;
    }

    res.status(200).json(data);
}
