import { useQuery } from 'react-query';
import { type SearchState } from 'context/SearchProvider';
import { type ParsedUrlQuery } from 'querystring';
import { getToolsApiURL } from 'utils/urls';
import { Tool } from '../types';

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

export function useToolsQueryCount(search: SearchState) {
    return useQuery('tools', () => fetchToolsDataFromSearch(search), {
        select: (tools) => tools.length,
    });
}

export function useAlternateToolsQuery(search: SearchState) {
    return useQuery('alternate-tools', () => fetchToolsDataFromSearch(search));
}
