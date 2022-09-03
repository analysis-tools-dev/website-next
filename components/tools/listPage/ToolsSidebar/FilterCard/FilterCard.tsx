import { FC, useEffect, useState } from 'react';
import { withRouter, type Router } from 'next/router';
import { Button, Input } from '@components/elements';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';

import styles from './FilterCard.module.css';
import { objectToQueryString } from 'utils/query';
import { useRouterPush } from 'hooks';
import { useSearchState } from 'context/SearchProvider';
import {
    isChecked,
    isSelectedFilter,
    resetQuery,
    sortByChecked,
} from './utils';
import { changeQuery } from 'utils/query';

export interface FilterOption {
    tag: string;
    name: string;
    tag_type?: string;
    results?: number;
}

export interface FilterCardProps {
    heading: string;
    filter: string;
    options: FilterOption[];
    limit?: number;
    router: Router;
}

// TODO: Add Toggle Deprecated (default off)
// TODO: Add click functionality and debounce
const FilterCard: FC<FilterCardProps> = ({
    heading,
    filter,
    options,
    limit = 10,
}) => {
    const { search, setSearch } = useSearchState();
    const routerPush = useRouterPush();

    const shouldShowToggle = options.length > limit;
    const [listLimit, setLimit] = useState(limit);
    const toggleAll = () => {
        if (listLimit === 999) {
            setLimit(limit);
        } else {
            setLimit(999);
        }
    };

    useEffect(() => {
        if (Object.keys(search).length) {
            routerPush(`/tools?${objectToQueryString(search)}`, undefined, {
                shallow: true,
            });
        }
    }, [search, routerPush]);

    const resetFilter = () => {
        if (search[filter]) {
            delete search[filter];
        }
        setSearch({ ...search });

        routerPush(`/tools?${objectToQueryString(search)}`, undefined, {
            shallow: true,
        });
    };

    if (options.length > limit) {
        options.sort(sortByChecked(filter, search));
    }

    return (
        <Card className="m-b-30">
            <Heading level={3} className="m-b-16 font-bold">
                {heading}
            </Heading>

            <ul className={styles.checklist}>
                <li>
                    <Input
                        type="checkbox"
                        id="checkbox_all"
                        data-filter={filter}
                        checked={!isSelectedFilter(filter, search)}
                        onChange={resetFilter}
                    />
                    <label
                        className={styles.checkboxLabel}
                        htmlFor="checkbox_all"
                        onClick={resetFilter}>
                        All
                    </label>
                </li>
                {options.slice(0, listLimit).map((option, index) => (
                    <li key={index}>
                        <Input
                            type="checkbox"
                            id={`checkbox_${option.tag}`}
                            value={option.tag}
                            data-filter={filter}
                            checked={isChecked(filter, option.tag, search)}
                            onChange={changeQuery(
                                option.tag,
                                search,
                                setSearch,
                            )}
                        />
                        <label
                            className={styles.checkboxLabel}
                            htmlFor={`checkbox_${option.tag}`}>
                            {option.name}
                        </label>

                        {option.results ? (
                            <label className={styles.optionResults}>
                                {option.results}
                            </label>
                        ) : null}
                    </li>
                ))}
            </ul>
            {shouldShowToggle ? (
                <Button
                    onClick={toggleAll}
                    theme="link"
                    className={styles.toggleAllBtn}>
                    {listLimit === 999 ? 'Show less ▴' : 'Show all ▾'}
                </Button>
            ) : null}
        </Card>
    );
};

export default withRouter(FilterCard);
