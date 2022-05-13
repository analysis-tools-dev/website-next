import type { NextApiRequest, NextApiResponse } from 'next';
import { getTools } from 'utils-api/tools';
import { filterResults } from 'utils-api/filters';
import { getVotes } from 'utils-api/votes';
import { type Tool } from '@components/tools/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Tool[] | { error: string }>,
) {
    const data = await getTools();
    const votes = await getVotes();

    if (!data || !votes) {
        res.status(500).json({ error: 'Failed to load data' });
        return res;
    }

    const filteredData = filterResults(data, req.query);

    const toolData = filteredData.map((tool) => {
        const key = `toolsyaml${tool.id.toString()}`;
        const voteData = votes[key]?.sum || 0;
        return { ...tool, votes: voteData };
    });

    res.status(200).json(toolData);
}
