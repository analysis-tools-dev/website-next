import { useRouter } from 'next/router';
import { createContext, FC, useContext, useState } from 'react';

export type SearchFilter = 'languages' | 'categories' | 'types' | 'licenses';
export interface SearchState {
    languages?: string[] | string;
    categories?: string[];
    types?: string[];
    licenses?: string[];
}

export interface SearchContextType {
    search: SearchState;
    setSearch: any; // TODO: Fix type here
}

const INITIAL_STATE: SearchState = {
    languages: [],
    categories: [],
    types: [],
    licenses: [],
};

const INITIAL_CONTEXT: SearchContextType = {
    search: INITIAL_STATE,
    setSearch: {},
};

const SearchContext = createContext(INITIAL_CONTEXT);

export const SearchProvider: FC = ({ children }) => {
    const router = useRouter();

    const [search, setSearch] = useState(router.query);
    return (
        <SearchContext.Provider
            value={{
                search,
                setSearch,
            }}>
            {children}
        </SearchContext.Provider>
    );
};

export function useSearchSate() {
    const context = useContext(SearchContext);

    if (!context)
        throw new Error('useSearch must be used inside a `SearchProvider`');

    return context;
}
