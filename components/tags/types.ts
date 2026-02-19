/**
 * Valid filter keys for tool filtering
 */
export type FilterKey = 'categories' | 'types' | 'licenses' | 'pricing';

/**
 * State object for tool filters
 */
export interface FiltersState {
    categories: string[];
    types: string[];
    licenses: string[];
    pricing: string[];
}

/**
 * Callback type for filter changes
 */
export type OnFilterChange = (
    filter: FilterKey,
    value: string,
    checked: boolean,
) => void;
