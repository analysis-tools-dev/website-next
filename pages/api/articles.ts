import type { NextApiRequest, NextApiResponse } from 'next';
import { getArticles } from 'utils/api';
import { type Article } from 'utils';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Article[] | { error: string }>,
) {
    const data = await getArticles();
    if (!data) {
        res.status(500).json({ error: 'Failed to load article data' });
        return res;
    }

    res.status(200).json(data);
}
