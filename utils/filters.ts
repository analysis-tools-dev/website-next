/**
 * Filters Utility Module
 *
 * This module provides utilities for filtering tools based on various criteria.
 * It works with the static tools data and can be used both at build time
 * and runtime (client-side).
 *
 * This replaces the old utils-api/filters.ts
 */

import { Tool } from '@components/tools/types';
import { ParsedUrlQuery } from 'querystring';
import { containsArray } from './arrays';
import type { ApiTool, ToolsApiData } from './types';

/**
 * Filter tools based on URL query parameters
 *
 * @param tools - Tools data object (keyed by tool ID)
 * @param query - URL query parameters
 * @returns Array of filtered tools
 */
export function filterResults(
    tools: ToolsApiData | null,
    query: ParsedUrlQuery,
): Tool[] {
    if (!tools) {
        return [];
    }

    const { languages, others, categories, types, licenses, pricing } = query;
    const result: Tool[] = [];

    for (const [key, tool] of Object.entries(tools)) {
        // Filter by languages
        if (languages) {
            if (!matchesFilter(tool.languages, languages, tool)) {
                continue;
            }
        }

        // Filter by other tags
        if (others) {
            if (!matchesFilter(tool.other, others, tool)) {
                continue;
            }
        }

        // Filter by categories
        if (categories) {
            if (!matchesArrayFilter(tool.categories, categories)) {
                continue;
            }
        }

        // Filter by types
        if (types) {
            if (!matchesArrayFilter(tool.types, types)) {
                continue;
            }
        }

        // Filter by licenses
        if (licenses) {
            if (!matchesArrayFilter(tool.licenses, licenses)) {
                continue;
            }
        }

        // Filter by pricing
        if (pricing) {
            if (!matchesPricingFilter(tool, pricing)) {
                continue;
            }
        }

        // All filters passed
        result.push({ id: key, ...tool } as Tool);
    }

    return result;
}

/**
 * Filter tools by tags (languages or others)
 *
 * @param tools - Tools data object
 * @param tags - Tag(s) to filter by
 * @returns Array of tools matching the tags
 */
export function filterByTags(
    tools: ToolsApiData | null,
    tags: string | string[],
): Tool[] {
    if (!tools) {
        return [];
    }

    const result: Tool[] = [];
    const tagArray = Array.isArray(tags) ? tags : [tags];

    for (const [key, tool] of Object.entries(tools)) {
        const matchesLanguage = tagArray.some((tag) =>
            tool.languages.includes(tag),
        );
        const matchesOther = tagArray.some((tag) => tool.other.includes(tag));

        if (matchesLanguage || matchesOther) {
            result.push({ id: key, ...tool } as Tool);
        }
    }

    return result;
}

/**
 * Filter tools by a single language
 */
export function filterByLanguage(
    tools: ToolsApiData | null,
    language: string,
): Tool[] {
    return filterByTags(tools, language);
}

/**
 * Filter tools by category
 */
export function filterByCategory(
    tools: ToolsApiData | null,
    category: string,
): Tool[] {
    if (!tools) {
        return [];
    }

    return Object.entries(tools)
        .filter(([, tool]) => tool.categories.includes(category))
        .map(([id, tool]) => ({ id, ...tool } as Tool));
}

/**
 * Filter tools by type
 */
export function filterByType(tools: ToolsApiData | null, type: string): Tool[] {
    if (!tools) {
        return [];
    }

    return Object.entries(tools)
        .filter(([, tool]) => tool.types.includes(type))
        .map(([id, tool]) => ({ id, ...tool } as Tool));
}

/**
 * Check if a tool is language-specific (supports only 1-2 languages)
 */
export function isSingleLanguageTool(tool: Tool | ApiTool): boolean {
    return tool.languages.length <= 2;
}

/**
 * Check if a tool is specific to a given language
 */
export function isToolLanguageSpecific(
    tool: Tool | ApiTool,
    language: string,
): boolean {
    return isSingleLanguageTool(tool) && tool.languages.includes(language);
}

/**
 * Helper: Check if tool field matches filter (for languages/others)
 * Multi-language tools need to match all filter values
 */
function matchesFilter(
    toolValues: string[],
    filterValue: string | string[],
    tool: ApiTool,
): boolean {
    if (Array.isArray(filterValue)) {
        const isMultiLanguage = !isSingleLanguageTool(tool);
        const matches = containsArray(toolValues, filterValue);
        return isMultiLanguage && matches;
    }
    return toolValues.includes(filterValue);
}

/**
 * Helper: Check if tool field matches array filter
 */
function matchesArrayFilter(
    toolValues: string[],
    filterValue: string | string[],
): boolean {
    if (Array.isArray(filterValue)) {
        return containsArray(toolValues, filterValue);
    }
    return toolValues.includes(filterValue);
}

/**
 * Helper: Check if tool matches pricing filter
 */
function matchesPricingFilter(
    tool: ApiTool,
    pricing: string | string[],
): boolean {
    const pricingArray = Array.isArray(pricing) ? pricing : [pricing];

    for (const filter of pricingArray) {
        if (filter === 'plans' && !tool.plans) {
            return false;
        }
        if (filter === 'oss' && !tool.plans?.oss) {
            return false;
        }
        if (filter === 'free' && !tool.plans?.free) {
            return false;
        }
    }

    return true;
}

/**
 * Sort tools by votes (descending)
 */
export function sortByVotes(tools: Tool[]): Tool[] {
    return [...tools].sort((a, b) => (b.votes || 0) - (a.votes || 0));
}

/**
 * Sort tools by name (ascending)
 */
export function sortByName(tools: Tool[]): Tool[] {
    return [...tools].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Paginate tools array
 */
export function paginateTools(
    tools: Tool[],
    offset: number,
    limit: number,
): { data: Tool[]; nextCursor?: number; total: number } {
    const total = tools.length;
    const data = tools.slice(offset, offset + limit);
    const nextCursor = offset + limit < total ? offset + limit : undefined;

    return { data, nextCursor, total };
}
