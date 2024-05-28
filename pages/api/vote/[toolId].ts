import type { NextApiRequest, NextApiResponse } from 'next';
import { PREFIX, VoteAPIResponse, publishVote } from 'utils-api/votes';
import { validateVoteAction } from 'utils/votes';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ data: VoteAPIResponse | null; error?: string }>,
) {
    try {
        const { toolId, vote } = req.query;
        const forwarded = req.headers['x-forwarded-for'];
        const ip = forwarded
            ? forwarded.toString().split(/, /)[0]
            : req.socket.remoteAddress;

        if (!toolId || !ip || !vote || !validateVoteAction(vote)) {
            console.error(
                `ERROR: Invalid request - toolId: ${toolId}, ip: ${ip}, vote: ${vote}`,
            );
            res.status(400).json({ error: 'Invalid request', data: null });
            return;
        }

        const result = await publishVote(
            toolId.toString(),
            ip,
            Number(vote.toString()),
        );

        if (!result || !result.writeTime) {
            console.error(
                `ERROR: Error processing request for toolId: ${toolId}, ip: ${ip}, vote: ${vote}`,
            );
            res.status(500).json({
                error: 'Error processing request',
                data: null,
            });
            return;
        }

        res.status(200).json({
            data: {
                id: `${PREFIX}${toolId}`,
                date: new Date(),
                vote: Number(vote),
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
