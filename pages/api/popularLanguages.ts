import type { NextApiRequest, NextApiResponse } from 'next';
import { type ToolsByLanguage } from '@components/tools/types';
import { getPopularLanguageStats } from 'utils-api/popularLanguageStats';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ data: ToolsByLanguage | null; error?: string }>,
) {
    try {
        const data = await getPopularLanguageStats();

        if (!data) {
            console.error('ERROR: Failed to load popular languages data');
            res.status(500).json({
                error: 'Failed to load popular languages data',
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
