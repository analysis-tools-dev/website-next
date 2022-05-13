import { SearchFilter, SearchState } from 'context/SearchProvider';
import { getFilterAsArray } from 'utils/query';
import { FilterOption } from './FilterCard';

export const isSelectedFilter = (key: string, search: SearchState) => {
    const filter = getFilterAsArray(search, key);
    return filter.length ? true : false;
};

export const isChecked = (key: string, value: string, search: SearchState) => {
    const filter = getFilterAsArray(search, key);
    return filter.includes(value) ? true : false;
};

export const changeQuery =
    (val: string, search: SearchState, setSearch: any) => (e: any) => {
        const key = e.target.dataset.filter;
        const currValue = getFilterAsArray(search, key);
        if (currValue.length) {
            const index = currValue.indexOf(val);
            if (index > -1) {
                currValue.splice(index, 1);
            } else {
                currValue.push(val);
            }
        } else {
            currValue.push(val);
        }
        setSearch({ ...search, [key]: currValue?.join(',') });
    };

export const resetQuery = (search: SearchState, setSearch: any) => (e: any) => {
    const key = e.target.dataset.filter as SearchFilter;

    if (search[key]) {
        delete search[key];
    }
    console.log(search);

    setSearch({ ...search });
};

export const sortByChecked = (filter: string, search: SearchState) => {
    return (a: FilterOption, b: FilterOption) => {
        const isAChecked = isChecked(filter, a.tag, search);
        const isBChecked = isChecked(filter, b.tag, search);

        return isAChecked === isBChecked ? 0 : isAChecked ? -1 : 1;
    };
};
