// TODO: Remove the following two lines and fix the type checker errors
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { SearchState, SetSearchStateAction } from 'context/SearchProvider';

export const objectToQueryString = (query) => {
    const paramStrings: string[] = [];
    Object.entries(query).forEach(([key, value]) => {
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

export const changeQuery =
    (val: string, search: SearchState, setSearch: SetSearchStateAction) =>
    (e: any) => {
        const key = e.target.dataset.filter;
        let currValue = search[key] || [];
        if (!Array.isArray(currValue)) {
            currValue = [currValue];
        }
        if (currValue.length) {
            const index = currValue.indexOf(val);
            if (index > -1) {
                currValue.splice(index, 1);
            } else {
                currValue.push(val);
            }
        } else {
            currValue.push(val);
        }
        setSearch({ ...search, [key]: currValue });
    };
