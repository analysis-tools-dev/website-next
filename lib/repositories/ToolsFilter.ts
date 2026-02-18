/**
 * ToolsFilter
 *
 * Filter class for filtering tools based on various criteria.
 * Works with tools data from ToolsRepository.
 */

import type { Tool } from '@components/tools/types';
import type { ApiTool, ToolsApiData } from 'utils/types';
import type { ParsedUrlQuery } from 'querystring';

export class ToolsFilter {
    private tools: ToolsApiData;

    constructor(tools: ToolsApiData) {
        this.tools = tools;
    }

    static from(tools: ToolsApiData): ToolsFilter {
        return new ToolsFilter(tools);
    }

    private toToolArray(entries: [string, ApiTool][]): Tool[] {
        return entries.map(([id, tool]) => ({
            ...tool,
            id,
            votes: tool.votes || 0,
        })) as Tool[];
    }

    private isSingleLanguageTool(tool: ApiTool): boolean {
        return tool.languages.length <= 2;
    }

    private containsArray(arr: string[], values: string[]): boolean {
        return values.every((value) => arr.includes(value));
    }

    byLanguage(language: string): Tool[] {
        const entries = Object.entries(this.tools).filter(([, tool]) =>
            tool.languages.includes(language.toLowerCase()),
        );
        return this.toToolArray(entries);
    }

    byLanguages(languages: string[]): Tool[] {
        const entries = Object.entries(this.tools).filter(([, tool]) => {
            const isMultiLanguage = !this.isSingleLanguageTool(tool);
            return (
                isMultiLanguage && this.containsArray(tool.languages, languages)
            );
        });
        return this.toToolArray(entries);
    }

    byCategory(category: string): Tool[] {
        const entries = Object.entries(this.tools).filter(([, tool]) =>
            tool.categories.includes(category.toLowerCase()),
        );
        return this.toToolArray(entries);
    }

    byType(type: string): Tool[] {
        const entries = Object.entries(this.tools).filter(([, tool]) =>
            tool.types.includes(type.toLowerCase()),
        );
        return this.toToolArray(entries);
    }

    byLicense(license: string): Tool[] {
        const entries = Object.entries(this.tools).filter(([, tool]) =>
            tool.licenses.includes(license),
        );
        return this.toToolArray(entries);
    }

    byTag(tag: string): Tool[] {
        const entries = Object.entries(this.tools).filter(
            ([, tool]) =>
                tool.languages.includes(tag) || tool.other.includes(tag),
        );
        return this.toToolArray(entries);
    }

    byTags(tags: string[]): Tool[] {
        const entries = Object.entries(this.tools).filter(([, tool]) => {
            const matchesLanguage = tags.some((t) =>
                tool.languages.includes(t),
            );
            const matchesOther = tags.some((t) => tool.other.includes(t));
            return matchesLanguage || matchesOther;
        });
        return this.toToolArray(entries);
    }

    byQuery(query: ParsedUrlQuery): Tool[] {
        const { languages, others, categories, types, licenses, pricing } =
            query;
        const result: Tool[] = [];

        for (const [key, tool] of Object.entries(this.tools)) {
            if (languages && !this.matchesLanguageFilter(tool, languages)) {
                continue;
            }

            if (others && !this.matchesOthersFilter(tool, others)) {
                continue;
            }

            if (
                categories &&
                !this.matchesArrayFilter(tool.categories, categories)
            ) {
                continue;
            }

            if (types && !this.matchesArrayFilter(tool.types, types)) {
                continue;
            }

            if (licenses && !this.matchesArrayFilter(tool.licenses, licenses)) {
                continue;
            }

            if (pricing && !this.matchesPricingFilter(tool, pricing)) {
                continue;
            }

            result.push({
                ...tool,
                id: key,
                votes: tool.votes || 0,
            } as Tool);
        }

        return result;
    }

    private matchesLanguageFilter(
        tool: ApiTool,
        filter: string | string[],
    ): boolean {
        if (Array.isArray(filter)) {
            const isMultiLanguage = !this.isSingleLanguageTool(tool);
            return (
                isMultiLanguage && this.containsArray(tool.languages, filter)
            );
        }
        return tool.languages.includes(filter);
    }

    private matchesOthersFilter(
        tool: ApiTool,
        filter: string | string[],
    ): boolean {
        if (Array.isArray(filter)) {
            const isMultiLanguage = !this.isSingleLanguageTool(tool);
            return isMultiLanguage && this.containsArray(tool.other, filter);
        }
        return tool.other.includes(filter);
    }

    private matchesArrayFilter(
        toolValues: string[],
        filter: string | string[],
    ): boolean {
        if (Array.isArray(filter)) {
            return this.containsArray(toolValues, filter);
        }
        return toolValues.includes(filter);
    }

    private matchesPricingFilter(
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

    all(): Tool[] {
        return this.toToolArray(Object.entries(this.tools));
    }

    sortByVotes(tools: Tool[]): Tool[] {
        return [...tools].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    }

    sortByName(tools: Tool[]): Tool[] {
        return [...tools].sort((a, b) => a.name.localeCompare(b.name));
    }

    paginate(
        tools: Tool[],
        offset: number,
        limit: number,
    ): { data: Tool[]; nextCursor?: number; total: number } {
        const total = tools.length;
        const data = tools.slice(offset, offset + limit);
        const nextCursor = offset + limit < total ? offset + limit : undefined;

        return { data, nextCursor, total };
    }
}
