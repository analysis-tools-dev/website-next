import type { NextApiRequest, NextApiResponse } from 'next';
import {
    getGithubStats,
    getRepositoryMeta,
    getTool,
    getToolVotes,
} from 'utils/api';
import { Tool } from '@components/tools';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Tool | { error: string }>,
) {
    const { toolId } = req.query;

    if (!toolId) {
        res.status(500);
        return res;
    }

    const data = await getTool(toolId.toString());
    if (!data) {
        res.status(500).json({ error: 'Failed to load data' });
        return res;
    }
    const votes = await getToolVotes(toolId.toString());

    const repoMeta = getRepositoryMeta(data.source);
    if (repoMeta) {
        const githubData = await getGithubStats(
            toolId.toString(),
            repoMeta.owner,
            repoMeta.repo,
        );
        if (githubData) {
            res.status(200).json({
                ...data,
                votes: votes,
                repositoryData: githubData,
            });
            return res;
        }
    }
    res.status(200).json({ ...data, votes: votes });
    return res;
}
