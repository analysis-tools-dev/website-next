import { Tool } from '@components/tools/types';
import { APIPaths, getApiURL } from './urls';

export enum VoteAction {
    UPVOTE = 1,
    DOWNVOTE = -1,
}

export const votesFormatter = (num: number) => {
    const res =
        Math.abs(num) > 999
            ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + 'K'
            : Math.sign(num) * Math.abs(num);

    return res.toString();
};

// sort tools by votes
export const sortByVote = (a: Tool, b: Tool) => {
    return b.votes - a.votes;
};

export const validateVoteAction = (action: unknown) => {
    const voteAction = Number(action);
    if (Object.values(VoteAction).includes(voteAction as VoteAction)) {
        return true;
    }
    return false;
};

/**
 * Submit vote for toolId to API
 * @desc This function will submit a vote for a tool to the API
 *
 */
export const submitVote = async (toolId: string, action: VoteAction) => {
    const voteApiURL = `${getApiURL(APIPaths.VOTE)}/${toolId}?vote=${action}`;
    const response = await fetch(voteApiURL);
    return await response.json();
};
