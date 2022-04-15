import { useQuery } from 'react-query';
import { APIPaths, getApiURL } from 'utils/urls';
import { Tool } from '../types';

export function useToolQuery(slug: string) {
    return useQuery(`tool-${slug}`, () => fetchToolData(slug));
}

export function fetchToolData(slug: string): Promise<Tool> {
    const toolApiURL = `${getApiURL(APIPaths.TOOL)}/${slug}`;
    return fetch(toolApiURL).then((response) => response.json());
}
