import { Tool } from '@components/tools/types';

export const votesFormatter = (num: number) => {
    return Math.abs(num) > 999
        ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + 'K'
        : Math.sign(num) * Math.abs(num);
};

// sort tools by votes
export const sortByVote = (a: Tool, b: Tool) => {
    return b.votes - a.votes;
};
