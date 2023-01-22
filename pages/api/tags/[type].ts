import type { NextApiRequest, NextApiResponse } from 'next';
import { getTags } from 'utils-api/tags';
import { isTagsType } from 'utils/type-guards';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | { error: string }>,
) {
    const { type } = req.query;

    if (!isTagsType(type)) {
        console.error(`ERROR: Invalid request - type not specified`);
        res.status(500);
        return res;
    }

    const data = await getTags(type);
    if (!data) {
        console.error(`ERROR: Failed to load ${type} data`);
        res.status(500).json({ error: 'Failed to load data' });
    }

    res.status(200).json(data);
    return res;
}
