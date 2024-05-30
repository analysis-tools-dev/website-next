import type { NextApiRequest, NextApiResponse } from 'next';
import { getArticles } from 'utils-api/blog';
import { type Article } from 'utils/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ data: Article[]; error?: string }>,
) {
    try {
        const data = await getArticles();

        if (!data) {
            console.error('ERROR: Failed to load article data');
            res.status(500).json({
                error: 'Failed to load article data',
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
