// TODO: Remove the following two lines and fix the type checker errors
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useRouter } from 'next/router';
import { createContext, FC, useContext, useState } from 'react';
import { MainHead } from '@components/core';

export type SetSearchStateAction = Dispatch<React.SetStateAction<SearchState>>;

export type SearchFilter =
    | 'languages'
    | 'others'
    | 'categories'
    | 'types'
    | 'licenses';
export interface SearchState {
    languages?: string[] | string;
    others?: string[] | string;
    categories?: string[];
    types?: string[];
    licenses?: string[];
    pricing?: string[];
    sorting: string;
}

export interface SearchContextType {
    search: SearchState;
    setSearch: SetSearchStateAction;
}

export const INITIAL_STATE: SearchState = {
    languages: [],
    others: [],
    categories: [],
    pricing: [],
    types: [],
    licenses: [],
    sorting: 'votes_desc',
};

const INITIAL_CONTEXT: SearchContextType = {
    search: INITIAL_STATE,
    setSearch: {},
};

const SearchContext = createContext(INITIAL_CONTEXT);

export interface SearchProviderProps {
    children?: React.ReactNode[];
}

export const SearchProvider: FC<SearchProviderProps> = ({ children }) => {
    const router = useRouter();

    const [search, setSearch] = useState(router.query);

    const title =
        'Analysis Tools, Linters, Formatters and Code Quality Checkers';
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    if (search.languages && search.languages.length > 0) {
        // concatenate the languages array into a string, capitalize it and add to the beginning of the title
        const languages = search.languages
            .map(
                (language) =>
                    language.charAt(0).toUpperCase() + language.slice(1),
            )
            .join('/');
        title = `${languages} ${title}`;
    }

    return (
        <>
            <MainHead title={title} description={description} />
            <SearchContext.Provider
                value={{
                    search,
                    setSearch,
                }}>
                {children}
            </SearchContext.Provider>
        </>
    );
};

export function useSearchState() {
    const context = useContext(SearchContext);

    if (!context)
        throw new Error(
            'useSearchState must be used inside a `SearchProvider`',
        );

    return context;
}
