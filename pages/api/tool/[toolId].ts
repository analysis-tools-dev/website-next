import type { NextApiRequest, NextApiResponse } from 'next';
import { getGithubStats } from 'utils-api/github';
import { getTool } from 'utils-api/tools';
import { getToolVotes } from 'utils-api/votes';
import { type Tool } from '@components/tools';
import { getRepositoryMeta } from 'utils/github';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Tool | { error: string }>,
) {
    const { toolId } = req.query;

    if (!toolId) {
        console.error(`ERROR: Invalid request - toolId not specified`);
        res.status(500);
        return res;
    }

    const data = await getTool(toolId.toString());
    if (!data) {
        console.error(`ERROR: Failed to load ${toolId} data`);
        res.status(500).json({ error: 'Failed to load data' });
        return res;
    }
    const { votes, upVotes, downVotes, upvotePercentage } = await getToolVotes(
        toolId.toString(),
    );

    const repoMeta = getRepositoryMeta(data.source);
    if (repoMeta) {
        const repositoryData = await getGithubStats(
            toolId.toString(),
            repoMeta.owner,
            repoMeta.repo,
        );
        if (repositoryData) {
            res.status(200).json({
                ...data,
                id: toolId.toString(),
                votes,
                upVotes,
                downVotes,
                upvotePercentage,
                repositoryData,
            });
            return res;
        }
    }
    res.status(200).json({ ...data, id: toolId.toString(), votes: votes });
    return res;
}
