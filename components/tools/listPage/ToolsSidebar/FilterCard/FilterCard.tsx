import { FC, useState } from 'react';
import { Button, Input } from '@components/elements';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';

import styles from './FilterCard.module.css';
import { SearchFilter, useSearchState } from 'context/SearchProvider';
import { isChecked, isSelectedFilter, sortByChecked } from './utils';
import { changeQuery } from 'utils/query';
import classNames from 'classnames';

export interface FilterOption {
    value: string;
    name: string;
    tag_type?: string;
    results?: number;
}

export interface FilterCardProps {
    showAllCheckbox?: boolean;
    heading: string;
    filter: string;
    options: FilterOption[];
    limit?: number;
    className?: string;
}

// TODO: Add Toggle Deprecated (default off)
// TODO: Add click functionality and debounce
const FilterCard: FC<FilterCardProps> = ({
    showAllCheckbox = true,
    heading,
    filter,
    options,
    limit = 10,
    className,
}) => {
    const { search, setSearch } = useSearchState();

    const shouldShowToggle = options.length > limit;
    const [listLimit, setLimit] = useState(limit);
    const toggleAll = () => {
        if (listLimit === 999) {
            setLimit(limit);
        } else {
            setLimit(999);
        }
    };

    const resetFilter = () => {
        const searchFilter = filter as SearchFilter;
        if (search[searchFilter]) {
            delete search[searchFilter];
        }
        setSearch({ ...search });
    };

    if (options.length > limit) {
        options.sort(sortByChecked(filter, search));
    }

    return (
        <Card className={classNames(className)}>
            <Heading level={3} className="m-b-16 font-bold">
                {heading}
            </Heading>

            <ul className={styles.checklist}>
                {showAllCheckbox && (
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
                )}
                {options.slice(0, listLimit).map((option, index) => (
                    <li key={index}>
                        <Input
                            type="checkbox"
                            id={`checkbox_${option.value}`}
                            value={option.value}
                            data-filter={filter}
                            checked={isChecked(filter, option.value, search)}
                            onChange={changeQuery(
                                option.value,
                                search,
                                setSearch,
                            )}
                        />
                        <label
                            className={styles.checkboxLabel}
                            htmlFor={`checkbox_${option.value}`}>
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

export default FilterCard;
