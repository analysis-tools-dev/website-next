import { SearchState } from 'context/SearchProvider';

export const objectToQueryString = (search: SearchState) => {
    const paramStrings: string[] = [];
    Object.entries(search).forEach(([key, value]) => {
        if (value) {
            if (Array.isArray(value)) {
                value.forEach((val) => {
                    const paramValue = encodeURIComponent(val);
                    paramStrings.push(
                        `${encodeURIComponent(key)}=${paramValue}`,
                    );
                });
            } else {
                const paramValue = encodeURIComponent(value);
                paramStrings.push(`${encodeURIComponent(key)}=${paramValue}`);
            }
        }
    });

    return paramStrings.sort((a, b) => a.localeCompare(b)).join('&');
};

export const changeQuery =
    (val: string, search: SearchState, setSearch: any) => (e: any) => {
        const key = e.target.dataset.filter;
        const currValue = search[key] || [];
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
        setSearch({ ...search, [key]: currValue });
    };
