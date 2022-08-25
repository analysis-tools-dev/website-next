import { type Tool } from '@components/tools';

export function sortByVoteDesc(a: Tool, b: Tool) {
    return b.votes - a.votes;
}

export function sortByVoteAsc(a: Tool, b: Tool) {
    return a.votes - b.votes;
}

export function sortByAlphabetAsc(a: Tool, b: Tool) {
    return a.name.localeCompare(b.name);
}

export function sortByAlphabetDesc(a: Tool, b: Tool) {
    return b.name.localeCompare(a.name);
}

export const votesFormatter = (num: number) => {
    return Math.abs(num) > 999
        ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + 'K'
        : Math.sign(num) * Math.abs(num);
};
