import { useQuery } from 'react-query';
import { type SearchState } from 'context/SearchProvider';
import { type ParsedUrlQuery } from 'querystring';
import { type ApiTag } from 'utils/types';
import { APIPaths, getApiURL, getToolsApiURL } from 'utils/urls';
import { Tool } from './types';

export function fetchToolsDataFromQuery(
    query: ParsedUrlQuery,
): Promise<Tool[]> {
    const toolsApiURL = getToolsApiURL(query);
    return fetch(toolsApiURL).then((response) => response.json());
}

export function fetchToolsDataFromSearch(search: SearchState): Promise<Tool[]> {
    const toolsApiURL = getToolsApiURL(search);
    return fetch(toolsApiURL).then((response) => response.json());
}

export function useToolsQuery(search: SearchState) {
    return useQuery('tools', () => fetchToolsDataFromSearch(search));
}

export function useLanguagesQuery() {
    return useQuery('languages', fetchLanguages);
}

export function useLanguageQueryCount() {
    return useQuery('languages', fetchLanguages, {
        select: (languages) => languages.length,
    });
}

export function fetchLanguages(): Promise<ApiTag[]> {
    const languageTagsApiURL = getApiURL(APIPaths.LANGUAGE_TAGS);
    return fetch(languageTagsApiURL).then((response) => response.json());
}
