import { useQuery } from 'react-query';
import { type ApiTag } from 'utils/types';
import { APIPaths, getApiURL } from 'utils/urls';

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
