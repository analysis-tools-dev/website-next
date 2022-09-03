import { Tool } from '@components/tools';
import { ParsedUrlQuery } from 'querystring';
import { checkArraysIntersect } from 'utils/arrays';
import type { ApiTool, ToolsApiData } from 'utils/types';

export const filterResults = (tools: ToolsApiData, query: ParsedUrlQuery) => {
    // Filters to be checked
    const { languages, others, categories, types, licenses, pricing } = query;

    const keys = Object.keys(tools);
    const result = [];

    for (const key of keys) {
        const tool = tools[key];
        if (languages) {
            if (Array.isArray(languages)) {
                const isMultiLanguage = !isSingleLanguageTool(tool);
                const toolLanguagesMatch = checkArraysIntersect(
                    tool.languages,
                    languages,
                );
                if (!(isMultiLanguage && toolLanguagesMatch)) {
                    continue;
                }
            } else {
                if (!tool.languages.includes(languages)) {
                    continue;
                }
            }
        }
        // Check non-language tags
        if (others) {
            if (Array.isArray(others)) {
                const isMultiLanguage = !isSingleLanguageTool(tool);
                const toolOthersMatch = checkArraysIntersect(
                    tool.other,
                    others,
                );
                if (!(isMultiLanguage && toolOthersMatch)) {
                    continue;
                }
            } else {
                if (!tool.other.includes(others)) {
                    continue;
                }
            }
        }
        if (categories) {
            if (Array.isArray(categories)) {
                if (!checkArraysIntersect(tool.categories, categories)) {
                    continue;
                }
            } else {
                if (!tool.categories.includes(categories)) {
                    continue;
                }
            }
        }
        if (types) {
            if (Array.isArray(types)) {
                if (!checkArraysIntersect(tool.types, types)) {
                    continue;
                }
            } else {
                if (!tool.types.includes(types)) {
                    continue;
                }
            }
        }
        if (licenses) {
            if (Array.isArray(licenses)) {
                if (!checkArraysIntersect(tool.licenses, licenses)) {
                    continue;
                }
            } else {
                if (!tool.licenses.includes(licenses)) {
                    continue;
                }
            }
        }
        if (pricing) {
            if (Array.isArray(pricing)) {
                if (!tool.plans) {
                    continue;
                }
            } else {
                if (pricing.includes('plans')) {
                    if (!tool.plans) {
                        continue;
                    }
                }
                if (pricing.includes('oss')) {
                    if (!tool.plans?.oss) {
                        continue;
                    }
                }
                if (pricing.includes('free')) {
                    if (!tool.plans?.free) {
                        continue;
                    }
                }
            }
        }

        // Finally push if all checks passed
        result.push({ id: key, ...tool });
    }

    return result;
};

export const isToolLanguageSpecific = (
    tool: Tool | ApiTool,
    languages: string,
) => {
    const isSingleLanguage = isSingleLanguageTool(tool);
    const toolLanguageMatch = tool.languages.includes(languages);

    return isSingleLanguage && toolLanguageMatch;
};

export const isSingleLanguageTool = (tool: Tool | ApiTool) => {
    return tool.languages.length <= 2;
};
