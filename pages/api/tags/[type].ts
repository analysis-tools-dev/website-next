import type { NextApiRequest, NextApiResponse } from 'next';
import { getTags } from 'utils-api/tags';
import { isTagsType } from 'utils/type-guards';
import { ApiTag, TagsType } from 'utils/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ data: ApiTag[]; error?: string }>,
) {
    try {
        const { type } = req.query;

        if (!type || Array.isArray(type) || !isTagsType(type)) {
            console.error(
                `ERROR: Invalid request - type not specified or invalid`,
            );
            res.status(400).json({
                error: 'Invalid request - type not specified or invalid',
                data: [],
            });
            return;
        }

        const data = await getTags(type as TagsType);

        if (!data) {
            console.error(`ERROR: Failed to load ${type} data`);
            res.status(500).json({ error: 'Failed to load data', data: [] });
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
