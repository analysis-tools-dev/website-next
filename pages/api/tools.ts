import type { NextApiRequest, NextApiResponse } from 'next';
import { filterResults } from 'utils';
import { type Tool } from '@components/tools/types';
import { getVotes } from 'utils/api';
import { getTools } from 'utils/api';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Tool[] | { error: string }>,
) {
    const data = await getTools();
    if (!data) {
        res.status(500).json({ error: 'Failed to load data' });
        return res;
    }

    const votes = await getVotes();
    const filteredData = filterResults(data, req);

    const toolData = filteredData.map((tool) => {
        const key = `toolsyaml${tool.id.toString()}`;
        const voteData = votes[key]?.sum || 0;
        return { ...tool, votes: voteData };
    });

    res.status(200).json(toolData);
}
