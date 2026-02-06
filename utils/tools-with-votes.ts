/**
 * Tools With Votes Utility
 *
 * This module combines static tools data with votes from Firebase.
 * It provides a simplified interface for getting tools with their vote counts.
 *
 * This replaces the old utils-api/toolsWithVotes.ts
 */

import { getStaticTools } from './static-data';
import { calculateUpvotePercentage } from './votes';
import { isToolsApiData, isVotesApiData } from './type-guards';
import type { ToolsApiData, VotesApiData } from './types';
import { Tool } from '@components/tools/types';

/**
 * Merge tools data with votes data
 * This is a pure function that takes tools and votes and returns enriched tools
 */
export function mergeToolsWithVotes(
    tools: ToolsApiData,
    votes: VotesApiData | null,
): ToolsApiData {
    if (!votes) {
        return tools;
    }

    const result = { ...tools };

    Object.keys(result).forEach((toolId) => {
        const key = `toolsyaml${toolId}`;
        const v = votes[key];

        const sum = v?.sum || 0;
        const upVotes = v?.upVotes || 0;
        const downVotes = v?.downVotes || 0;

        result[toolId] = {
            ...result[toolId],
            votes: sum,
            upVotes,
            downVotes,
            upvotePercentage: calculateUpvotePercentage(upVotes, downVotes),
        };
    });

    return result;
}

/**
 * Get tools with votes as an array
 */
export function toolsToArray(tools: ToolsApiData): Tool[] {
    return Object.entries(tools).map(([id, tool]) => ({
        ...tool,
        id,
        votes: tool.votes || 0,
    })) as Tool[];
}

/**
 * Get all tools with votes from static data
 *
 * This is the main function to use. It:
 * 1. Gets tools from static JSON (no network call)
 * 2. Optionally merges with votes if provided
 *
 * For server-side use, pass votes fetched from Firebase.
 * For client-side use without votes, just call with no arguments.
 */
export function getToolsWithVotes(votes?: VotesApiData | null): ToolsApiData {
    const tools = getStaticTools();

    if (!isToolsApiData(tools)) {
        console.error('Error loading tools data');
        return {};
    }

    if (votes && isVotesApiData(votes)) {
        return mergeToolsWithVotes(tools, votes);
    }

    return tools;
}

/**
 * Get tools with votes as an array
 */
export function getToolsWithVotesArray(votes?: VotesApiData | null): Tool[] {
    const tools = getToolsWithVotes(votes);
    return toolsToArray(tools);
}

/**
 * Get a single tool with votes
 */
export function getToolWithVotes(
    toolId: string,
    votes?: VotesApiData | null,
): Tool | null {
    const tools = getToolsWithVotes(votes);
    const tool = tools[toolId];

    if (!tool) {
        return null;
    }

    return {
        ...tool,
        id: toolId,
        votes: tool.votes || 0,
    } as Tool;
}
