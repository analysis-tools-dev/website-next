import { SearchState } from 'context/SearchProvider';
import { objectToQueryString } from 'utils/query';

export enum APIPaths {
    TOOLS = 'tools',
    TOOL = 'tool',
    BLOG = 'articles',
    VOTES = 'votes',
    TAGS = 'tags/other',
    LANGUAGE_TAGS = 'tags/languages',
}

export const getApiURL = (pathName?: string) => {
    let baseApiUrl = `https://${process.env.NEXT_PUBLIC_HOST}/api`;
    if (process.env.NODE_ENV === 'development') {
        baseApiUrl = `http://${process.env.NEXT_PUBLIC_HOST}/api`;
    }

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
