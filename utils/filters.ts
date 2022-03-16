import type { NextApiRequest } from 'next';
import { checkArraysIntersect } from './arrays';
import type { ToolsApiData } from './types';

export const filterResults = (tools: ToolsApiData, req: NextApiRequest) => {
    // Filters to be checked
    const { languages, categories, types, licenses } = req.query;

    const keys = Object.keys(tools);
    const result = [];

    for (const key of keys) {
        const tool = tools[key];
        if (languages) {
            if (Array.isArray(languages)) {
                if (!checkArraysIntersect(tool.languages, languages)) {
                    continue;
                }
            } else {
                if (!tool.languages.includes(languages)) {
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
