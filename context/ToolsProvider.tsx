import {
    createContext,
    FC,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
import { useRouter } from 'next/router';
import type { Tool } from '@components/tools/types';
import type { ParsedUrlQuery } from 'querystring';

// Search state types
export type SearchFilter =
    | 'languages'
    | 'others'
    | 'categories'
    | 'types'
    | 'licenses'
    | 'pricing';

export interface SearchState {
    languages?: string[];
    others?: string[];
    categories?: string[];
    types?: string[];
    licenses?: string[];
    pricing?: string[];
    sorting?: string;
}

export type SortOption =
    | 'votes_desc'
    | 'votes_asc'
    | 'alphabetical_asc'
    | 'alphabetical_desc'
    | 'most_popular'
    | 'least_popular';

// Context types
export interface ToolsContextType {
    // All tools (unfiltered)
    allTools: Tool[];
    // Filtered and sorted tools
    tools: Tool[];
    // Total count of filtered tools
    totalCount: number;
    // Current search state
    search: SearchState;
    // Update search state
    setSearch: (search: SearchState) => void;
    // Update a single filter
    updateFilter: (filter: SearchFilter, values: string[]) => void;
    // Toggle a filter value
    toggleFilter: (filter: SearchFilter, value: string) => void;
    // Clear all filters
    clearFilters: () => void;
    // Set sorting
    setSorting: (sorting: SortOption) => void;
    // Check if a filter value is selected
    isSelected: (filter: SearchFilter, value: string) => boolean;
    // Get count of tools matching a language
    getLanguageCount: (language: string) => number;
    // Loading state (for future use)
    isLoading: boolean;
}

const INITIAL_CONTEXT: ToolsContextType = {
    allTools: [],
    tools: [],
    totalCount: 0,
    search: {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setSearch: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    updateFilter: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    toggleFilter: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    clearFilters: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setSorting: () => {},
    isSelected: () => false,
    getLanguageCount: () => 0,
    isLoading: false,
};

const ToolsContext = createContext<ToolsContextType>(INITIAL_CONTEXT);

// Helper to parse query params into SearchState
function parseQueryToSearch(query: ParsedUrlQuery): SearchState {
    const search: SearchState = {};

    const arrayFields: SearchFilter[] = [
        'languages',
        'others',
        'categories',
        'types',
        'licenses',
        'pricing',
    ];

    for (const field of arrayFields) {
        const value = query[field];
        if (value) {
            search[field] = Array.isArray(value) ? value : [value];
        }
    }

    if (query.sorting && typeof query.sorting === 'string') {
        search.sorting = query.sorting;
    }

    return search;
}

// Helper to convert SearchState to query string
function searchToQueryString(search: SearchState): string {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(search)) {
        if (value === undefined || value === null) continue;

        if (Array.isArray(value)) {
            for (const v of value) {
                params.append(key, v);
            }
        } else if (typeof value === 'string' && value) {
            params.set(key, value);
        }
    }

    return params.toString();
}

// Sorting functions
function sortTools(tools: Tool[], sorting?: string): Tool[] {
    const sorted = [...tools];

    switch (sorting) {
        case 'votes_asc':
            return sorted.sort((a, b) => (a.votes || 0) - (b.votes || 0));
        case 'alphabetical_asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'alphabetical_desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'most_popular':
        case 'votes_desc':
        default:
            return sorted.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    }
}

// Filter function
function filterTools(tools: Tool[], search: SearchState): Tool[] {
    return tools.filter((tool) => {
        // Languages filter
        if (search.languages && search.languages.length > 0) {
            const hasLanguage = search.languages.some((lang) =>
                tool.languages?.includes(lang),
            );
            if (!hasLanguage) return false;
        }

        // Others filter
        if (search.others && search.others.length > 0) {
            const hasOther = search.others.some((other) =>
                tool.other?.includes(other),
            );
            if (!hasOther) return false;
        }

        // Categories filter
        if (search.categories && search.categories.length > 0) {
            const hasCategory = search.categories.some((cat) =>
                tool.categories?.includes(cat),
            );
            if (!hasCategory) return false;
        }

        // Types filter
        if (search.types && search.types.length > 0) {
            const hasType = search.types.some((type) =>
                tool.types?.includes(type),
            );
            if (!hasType) return false;
        }

        // Licenses filter
        if (search.licenses && search.licenses.length > 0) {
            const hasLicense = search.licenses.some((license) =>
                tool.licenses?.includes(license),
            );
            if (!hasLicense) return false;
        }

        // Pricing filter
        if (search.pricing && search.pricing.length > 0) {
            for (const filter of search.pricing) {
                if (filter === 'plans' && !tool.plans) return false;
                if (filter === 'oss' && !tool.plans?.oss) return false;
                if (filter === 'free' && !tool.plans?.free) return false;
            }
        }

        return true;
    });
}

export interface ToolsProviderProps {
    children: React.ReactNode;
    initialTools: Tool[];
}

export const ToolsProvider: FC<ToolsProviderProps> = ({
    children,
    initialTools,
}) => {
    const router = useRouter();

    // Initialize search state from URL query
    const [search, setSearchState] = useState<SearchState>(() =>
        parseQueryToSearch(router.query),
    );

    // Memoize filtered and sorted tools
    const filteredTools = useMemo(() => {
        const filtered = filterTools(initialTools, search);
        return sortTools(filtered, search.sorting);
    }, [initialTools, search]);

    // Update URL when search changes
    const setSearch = useCallback(
        (newSearch: SearchState) => {
            setSearchState(newSearch);

            const queryString = searchToQueryString(newSearch);
            const url = queryString ? `/tools?${queryString}` : '/tools';

            router.push(url, undefined, { shallow: true });
        },
        [router],
    );

    // Update a single filter
    const updateFilter = useCallback(
        (filter: SearchFilter, values: string[]) => {
            const newSearch = { ...search };
            if (values.length === 0) {
                delete newSearch[filter];
            } else {
                newSearch[filter] = values;
            }
            setSearch(newSearch);
        },
        [search, setSearch],
    );

    // Toggle a filter value
    const toggleFilter = useCallback(
        (filter: SearchFilter, value: string) => {
            const currentValues = search[filter] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];

            updateFilter(filter, newValues);
        },
        [search, updateFilter],
    );

    // Clear all filters
    const clearFilters = useCallback(() => {
        setSearch({});
    }, [setSearch]);

    // Set sorting
    const setSorting = useCallback(
        (sorting: SortOption) => {
            setSearch({ ...search, sorting });
        },
        [search, setSearch],
    );

    // Check if a filter value is selected
    const isSelected = useCallback(
        (filter: SearchFilter, value: string): boolean => {
            const values = search[filter];
            if (!values) return false;
            return values.includes(value);
        },
        [search],
    );

    // Get count of tools matching a language (from all tools, not filtered)
    const getLanguageCount = useCallback(
        (language: string): number => {
            return initialTools.filter((tool) =>
                tool.languages?.includes(language),
            ).length;
        },
        [initialTools],
    );

    const contextValue: ToolsContextType = {
        allTools: initialTools,
        tools: filteredTools,
        totalCount: filteredTools.length,
        search,
        setSearch,
        updateFilter,
        toggleFilter,
        clearFilters,
        setSorting,
        isSelected,
        getLanguageCount,
        isLoading: false,
    };

    return (
        <ToolsContext.Provider value={contextValue}>
            {children}
        </ToolsContext.Provider>
    );
};

export function useTools(): ToolsContextType {
    const context = useContext(ToolsContext);

    if (!context) {
        throw new Error('useTools must be used inside a `ToolsProvider`');
    }

    return context;
}

// Re-export for backward compatibility with SearchProvider usage
export function useSearchState() {
    const { search, setSearch } = useTools();
    return { search, setSearch };
}
