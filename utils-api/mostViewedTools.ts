import { getToolsWithVotes } from './toolsWithVotes';
import { getToolStats } from './toolStats';

function nonNullable<T>(value: T): value is NonNullable<T> {
    return value !== null && value !== undefined;
}

export const getMostViewedTools = async () => {
    const data = await getToolsWithVotes();
    const tool_stats = await getToolStats();

    if (!data || !tool_stats) {
        console.error('Error loading most viewed tools');
        return null;
    }

    const mostViewedToolIds = Object.keys(tool_stats);
    const mostViewedTools = mostViewedToolIds
        .map((id) => {
            if (!data[id]) {
                return null;
            }

            return {
                id,
                ...data[id],
                views: Number(tool_stats[id]),
            };
        })
        .filter(nonNullable);

    return mostViewedTools;
};
