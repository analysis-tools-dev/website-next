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
        if (languages && Array.isArray(languages)) {
            if (!checkArraysIntersect(tool.languages, languages)) {
                continue;
            }
        }
        if (categories && Array.isArray(categories)) {
            if (!checkArraysIntersect(tool.categories, categories)) {
                continue;
            }
        }
        if (types && Array.isArray(types)) {
            if (!checkArraysIntersect(tool.types, types)) {
                continue;
            }
        }
        if (licenses && Array.isArray(licenses)) {
            if (!checkArraysIntersect(tool.licenses, licenses)) {
                continue;
            }
        }

        // Finaly push if all checks passed
        result.push(tool);
    }

    return result;
};
