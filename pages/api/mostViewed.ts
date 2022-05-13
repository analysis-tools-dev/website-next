import type { NextApiRequest, NextApiResponse } from 'next';
import { type Tool } from '@components/tools/types';
import { getToolStats } from 'utils-api/toolStats';
import { getTools } from 'utils-api/tools';
import { getVotes } from 'utils-api/votes';

function nonNullable<T>(value: T): value is NonNullable<T> {
    return value !== null && value !== undefined;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Tool[] | { error: string }>,
) {
    const data = await getTools();
    const tool_stats = await getToolStats();
    const votes = await getVotes();

    if (!data || !tool_stats || !votes) {
        res.status(500).json({ error: 'Failed to load most viewed tool data' });
        return res;
    }

    const mostViewedToolIds = Object.keys(tool_stats);
    const mostViewedTools = mostViewedToolIds
        .map((id) => {
            const voteKey = `toolsyaml${id.toString()}`;
            const voteData = votes[voteKey]?.sum || 0;

            if (!data[id]) {
                return null;
            }

            return {
                id,
                ...data[id],
                votes: voteData,
                views: Number(tool_stats[id]),
            };
        })
        .filter(nonNullable);
    res.status(200).json(mostViewedTools);
}
