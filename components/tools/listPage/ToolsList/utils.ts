import { SearchState } from 'context/SearchProvider';
import { getFilterAsArray } from 'utils/query';

export const changeSorting =
    (val: string, search: SearchState, setSearch: any) => (e: any) => {
        console.log(`changeSorting: ${val}`);
        setSearch({ ...search, sorting: val });
    };
