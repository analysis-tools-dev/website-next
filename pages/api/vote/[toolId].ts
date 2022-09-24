import type { NextApiRequest, NextApiResponse } from 'next';
import { publishVote } from 'utils-api/votes';
import { validateVoteAction } from 'utils/votes';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any | { error: string }>,
) {
    const { toolId, vote } = req.query;
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded
        ? forwarded.toString().split(/, /)[0]
        : req.socket.remoteAddress;

    if (!toolId || !ip || !vote || !validateVoteAction(vote)) {
        res.status(500).json({ error: 'Invalid request' });
        return res;
    }

    const result = await publishVote(
        toolId.toString(),
        ip,
        Number(vote.toString()),
    );

    if (!result || !result.writeTime) {
        res.status(500).json({ error: 'Error processing request' });
        return res;
    }

    res.status(200).json({
        id: `${process.env.VOTE_PREFIX}${toolId}`,
        date: new Date(),
        vote: vote,
    });
    return res;
}
