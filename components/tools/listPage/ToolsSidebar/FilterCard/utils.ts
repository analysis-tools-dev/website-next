import { SearchFilter, SearchState } from 'context/SearchProvider';
import { FilterOption } from './FilterCard';

export const isSelectedFilter = (key: string, search: SearchState) => {
    const searchFilter = key as SearchFilter;
    return search[searchFilter]?.length ? true : false;
};

export const isChecked = (key: string, value: string, search: SearchState) => {
    const searchFilter = key as SearchFilter;
    return search[searchFilter]?.includes(value) ? true : false;
};

export const resetQuery =
    (search: SearchState, setSearch: (state: SearchState) => void) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement;
        const key = target.dataset.filter as SearchFilter;

        if (search[key]) {
            delete search[key];
        }

        setSearch({ ...search });
    };

export const sortByChecked = (filter: string, search: SearchState) => {
    return (a: FilterOption, b: FilterOption) => {
        const isAChecked = isChecked(filter, a.value, search);
        const isBChecked = isChecked(filter, b.value, search);
        return isAChecked === isBChecked ? 0 : isAChecked ? -1 : 1;
    };
};
