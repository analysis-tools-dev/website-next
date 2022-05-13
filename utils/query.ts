import { SearchState } from 'context/SearchProvider';
import { ParsedUrlQuery } from 'querystring';

export const objectToQueryString = (search: SearchState) => {
    const paramStrings: string[] = [];
    Object.entries(search).forEach(([key, value]) => {
        if (value) {
            if (Array.isArray(value)) {
                value.forEach((val) => {
                    const paramValue = encodeURIComponent(val);
                    paramStrings.push(
                        `${encodeURIComponent(key)}=${paramValue}`,
                    );
                });
            } else {
                const paramValue = encodeURIComponent(value);
                paramStrings.push(`${encodeURIComponent(key)}=${paramValue}`);
            }
        }
    });

    return paramStrings.sort((a, b) => a.localeCompare(b)).join('&');
};

export const getFilterAsArray = (search: SearchState, key: string) => {
    const value = search[key as keyof SearchState];
    if (!value) {
        return [];
    }

    if (Array.isArray(value)) {
        return value;
    }
    return value.split(',');
};

export const getParamAsArray = (query: ParsedUrlQuery, key: string) => {
    const value = query[key];
    if (!value) {
        return [];
    }
    if (Array.isArray(value)) {
        return value;
    }
    return value.split(',');
};
