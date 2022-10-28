import { objectToQueryString } from 'utils/query';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export enum APIPaths {
    TOOLS = 'tools',
    TOOL = 'tool',
    BLOG = 'articles',
    VOTE = 'vote',
    VOTES = 'votes',
    OTHER_TAGS = 'tags/other',
    LANGUAGE_TAGS = 'tags/languages',
    MOST_VIEWED = 'mostViewed',
    POPULAR_LANGUAGES = 'popularLanguages',
}

export const getApiURL = (pathName?: string) => {
    const baseApiUrl = `${publicRuntimeConfig.publicHost}/api`;

    if (pathName && pathName !== '') {
        return `${baseApiUrl}/${pathName}`;
    }

    return baseApiUrl;
};

export const getToolsApiURL = (query?: Record<string, any>) => {
    let apiUrl = getApiURL(APIPaths.TOOLS);

    if (query) {
        const queryString = objectToQueryString(query);
        if (queryString) {
            apiUrl += `?${queryString}`;
        }
    }

    return apiUrl;
};
