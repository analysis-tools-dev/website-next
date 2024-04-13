import type { NextApiRequest, NextApiResponse } from 'next';
import { getTags } from 'utils-api/tags';
import { isTagsType } from 'utils/type-guards';
import { ApiTag } from 'utils/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ data: ApiTag[]; error?: string }>,
) {
    const { type } = req.query;

    if (!isTagsType(type)) {
        console.error(`ERROR: Invalid request - type not specified`);
        res.status(500).json({
            error: 'Invalid request - type not specified',
            data: [],
        });
        return res;
    }

    const data = await getTags(type);
    if (!data) {
        console.error(`ERROR: Failed to load ${type} data`);
        res.status(500).json({ error: 'Failed to load data', data: [] });
        return res;
    }

    res.status(200).json({ data });
    return res;
}
