import type { NextApiRequest, NextApiResponse } from 'next';
import { type Tool } from '@components/tools/types';
import { getVotes, getTools, getToolStats } from 'utils/api';

function nonNullable<T>(value: T): value is NonNullable<T> {
    return value !== null && value !== undefined;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Tool[] | { error: string }>,
) {
    const data = await getTools();
    const stats = await getToolStats();
    if (!data || !stats) {
        res.status(500).json({ error: 'Failed to load most viewed tool data' });
        return res;
    }
    const votes = await getVotes();

    const mostViewedToolIds = Object.keys(stats);
    const mostViewedTools = mostViewedToolIds
        .map((id) => {
            const voteKey = `toolsyaml${id.toString()}`;
            const voteData = votes[voteKey]?.sum || 0;

            return data[id]
                ? {
                      id,
                      ...data[id],
                      votes: voteData,
                      views: Number(stats[id].value),
                  }
                : null;
        })
        .filter(nonNullable);
    res.status(200).json(mostViewedTools);
}
