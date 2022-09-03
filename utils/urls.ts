import { SearchState } from 'context/SearchProvider';
import { objectToQueryString } from 'utils/query';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export enum APIPaths {
    TOOLS = 'tools',
    TOOL = 'tool',
    BLOG = 'articles',
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

export const getToolsApiURL = (search?: SearchState) => {
    let apiUrl = getApiURL(APIPaths.TOOLS);

    if (search) {
        const queryString = objectToQueryString(search);
        if (queryString) {
            apiUrl += `?${queryString}`;
        }
    }

    return apiUrl;
};
