import type { NextApiRequest, NextApiResponse } from 'next';
import { type ToolsByLanguage } from '@components/tools/types';
import { getPopularLanguageStats } from 'utils-api/popularLanguageStats';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ data: ToolsByLanguage; error?: string }>,
) {
    const data = await getPopularLanguageStats();
    if (!data) {
        res.status(500).json({
            error: 'Failed to load popular languages data',
            data: {},
        });
        return res;
    }

    res.status(200).json({ data });
}
