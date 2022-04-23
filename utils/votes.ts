import { type Tool } from '@components/tools';

export function sortByVote(a: Tool, b: Tool) {
    if (a.votes > b.votes) {
        return -1;
    }
    if (a.votes < b.votes) {
        return 1;
    }
    return 0;
}

export const votesFormatter = (num: number) => {
    return Math.abs(num) > 999
        ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + 'K'
        : Math.sign(num) * Math.abs(num);
};
