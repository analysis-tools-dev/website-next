/**
 * Query utilities for URL parameter handling
 */

/**
 * Converts an object to a query string
 * @param query - Object with key-value pairs to convert
 * @returns URL-encoded query string
 */
export const objectToQueryString = (
    query: Record<string, string | string[] | undefined>,
): string => {
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
            } else if (key !== 'slug') {
                const paramValue = encodeURIComponent(value);
                paramStrings.push(`${encodeURIComponent(key)}=${paramValue}`);
            }
        }
    });

    return paramStrings.sort((a, b) => a.localeCompare(b)).join('&');
};
