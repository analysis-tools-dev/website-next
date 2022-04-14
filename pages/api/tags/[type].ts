import type { NextApiRequest, NextApiResponse } from 'next';
import { getTag } from 'utils-api/tags';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | { error: string }>,
) {
    const { type } = req.query;

    if (!type) {
        console.error(`ERROR: Invalid request - type not specified`);
        res.status(500);
        return res;
    }

    const data = await getTag(type.toString());
    if (!data) {
        console.error(`ERROR: Failed to load ${type} data`);
        res.status(500).json({ error: 'Failed to load data' });
    }

    res.status(200).json(data);
    return res;
}
