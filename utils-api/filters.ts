import type { NextApiRequest } from 'next';
import { checkArraysIntersect } from '../arrays';
import type { ToolsApiData } from '../types';

function replaceKeys(object: any) {
    return Object.keys(object).forEach((key) => {
        const newKey = key.replace(/\s+/g, '');
        if (object[key] && typeof object[key] === 'object') {
            replaceKeys(object[key]);
        }
        if (key !== newKey) {
            object[newKey] = object[key];
            delete object[key];
        }
    });
}

export const filterResults = (tools: ToolsApiData, req: NextApiRequest) => {
    // Filters to be checked
    const { languages, categories, types, licenses } = req.query;

    const keys = Object.keys(tools);
    const result = [];

    for (const key of keys) {
        const tool = tools[key];
        if (languages) {
            if (Array.isArray(languages)) {
                const isMultiLanguage = tool.languages.length >= 2;
                const toolLanguagesMatch = checkArraysIntersect(
                    tool.languages,
                    languages,
                );
                if (!(isMultiLanguage && toolLanguagesMatch)) {
                    continue;
                }
            } else {
                const isSingleLanguage = tool.languages.length === 1;
                const toolLanguageMatch = tool.languages.includes(languages);
                if (!(isSingleLanguage && toolLanguageMatch)) {
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

        // Finaly push if all checks passed
        result.push({ id: key, ...tool });
    }

    return result;
};
