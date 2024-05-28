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
    try {
        const { toolId } = req.query;

        if (!toolId || typeof toolId !== 'string') {
            console.error(
                `ERROR: Invalid request - toolId not specified or invalid`,
            );
            res.status(400).json({
                error: 'Invalid request - toolId not specified or invalid',
                data: null,
            });
            return;
        }

        const data = await getTool(toolId);
        if (!data) {
            console.error(`ERROR: Failed to load data for toolId: ${toolId}`);
            res.status(404).json({
                error: `Failed to load data for toolId: ${toolId}`,
                data: null,
            });
            return;
        }

        const toolVotes = await getToolVotes(toolId);
        if (!toolVotes) {
            console.error(`ERROR: Failed to load votes for toolId: ${toolId}`);
            res.status(500).json({
                error: `Failed to load votes for toolId: ${toolId}`,
                data: null,
            });
            return;
        }

        const { votes, upVotes, downVotes, upvotePercentage } = toolVotes;

        const repoMeta = getRepositoryMeta(data.source);
        if (repoMeta) {
            console.log(`Getting repository data for toolId: ${toolId}`);
            const repositoryData = await getGithubStats(
                toolId,
                repoMeta.owner,
                repoMeta.repo,
            );
            if (repositoryData) {
                res.status(200).json({
                    data: {
                        ...data,
                        id: toolId,
                        votes,
                        upVotes,
                        downVotes,
                        upvotePercentage,
                        repositoryData,
                    },
                });
                return;
            }
        }

        console.log(`Returning data for proprietary tool toolId: ${toolId}`);
        res.status(200).json({
            data: {
                ...data,
                id: toolId,
                votes,
                upVotes,
                downVotes,
                upvotePercentage,
            },
        });
    } catch (error) {
        console.error('ERROR: An unexpected error occurred', error);
        res.status(500).json({
            error: 'An unexpected error occurred',
            data: null,
        });
    }
}
