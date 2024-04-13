import type { NextApiRequest, NextApiResponse } from 'next';
import { getGithubStats } from 'utils-api/github';
import { getTool } from 'utils-api/tools';
import { getToolVotes } from 'utils-api/votes';
import { type Tool } from '@components/tools';
import { getRepositoryMeta } from 'utils/github';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ data: Tool | null; error?: string }>,
) {
    const { toolId } = req.query;

    if (!toolId) {
        console.error(`ERROR: Invalid request - toolId not specified`);
        res.status(500).json({
            error: 'Invalid request - toolId not specified',
            data: null,
        });
        return res;
    }

    const data = await getTool(toolId.toString());
    if (!data) {
        console.error(`ERROR: Failed to load ${toolId} data`);
        res.status(500).json({
            error: `Failed to load ${toolId} data`,
            data: null,
        });
        return res;
    }
    console.log(`Getting votes for ${toolId}`);
    const { votes, upVotes, downVotes, upvotePercentage } = await getToolVotes(
        toolId.toString(),
    );

    const repoMeta = getRepositoryMeta(data.source);
    if (repoMeta) {
        console.log(`Getting repository data for ${toolId}`);
        const repositoryData = await getGithubStats(
            toolId.toString(),
            repoMeta.owner,
            repoMeta.repo,
        );
        if (repositoryData) {
            res.status(200).json({
                data: {
                    ...data,
                    id: toolId.toString(),
                    votes,
                    upVotes,
                    downVotes,
                    upvotePercentage,
                    repositoryData,
                },
            });
            return res;
        }
    }
    console.log(`Returning data for propiertary tool ${toolId}`);
    res.status(200).json({
        data: {
            ...data,
            id: toolId.toString(),
            votes: votes,
        },
    });
    return res;
}
