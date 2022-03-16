import { ParsedUrlQuery } from 'querystring';

export const objectToQueryString = (obj: ParsedUrlQuery) => {
    const paramStrings: string[] = [];
    Object.keys(obj).forEach((key: string) => {
        const value = obj[key];
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
