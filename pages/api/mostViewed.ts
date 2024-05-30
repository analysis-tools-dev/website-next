import type { NextApiRequest, NextApiResponse } from 'next';
import { type Tool } from '@components/tools/types';
import { getMostViewedTools } from 'utils-api/mostViewedTools';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ data: Tool[]; error?: string }>,
) {
    try {
        const data = await getMostViewedTools();

        if (!data) {
            console.error('ERROR: Failed to load most viewed tool data');
            res.status(500).json({
                error: 'Failed to load most viewed tool data',
                data: [],
            });
            return;
        }

        res.status(200).json({ data });
    } catch (error) {
        console.error('ERROR: An unexpected error occurred', error);
        res.status(500).json({
            error: 'An unexpected error occurred',
            data: [],
        });
    }
}
