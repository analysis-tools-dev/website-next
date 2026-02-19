import { FC, useState } from 'react';
import { Button, Input } from '@components/elements';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';

import styles from './FilterCard.module.css';
import { useTools, type SearchFilter } from 'context/ToolsProvider';
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

const FilterCard: FC<FilterCardProps> = ({
    showAllCheckbox = true,
    heading,
    filter,
    options,
    limit = 10,
    className,
}) => {
    const { search, toggleFilter, updateFilter, isSelected } = useTools();

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
        updateFilter(searchFilter, []);
    };

    const handleCheckboxChange = (value: string) => {
        const searchFilter = filter as SearchFilter;
        toggleFilter(searchFilter, value);
    };

    const isChecked = (value: string): boolean => {
        const searchFilter = filter as SearchFilter;
        return isSelected(searchFilter, value);
    };

    const isFilterActive = (): boolean => {
        const searchFilter = filter as SearchFilter;
        const values = search[searchFilter];
        return values !== undefined && values.length > 0;
    };

    // Sort options: checked items first
    const sortedOptions = [...options].sort((a, b) => {
        const aChecked = isChecked(a.value);
        const bChecked = isChecked(b.value);
        if (aChecked && !bChecked) return -1;
        if (!aChecked && bChecked) return 1;
        return 0;
    });

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
                            id={`checkbox_all_${filter}`}
                            data-filter={filter}
                            checked={!isFilterActive()}
                            onChange={resetFilter}
                        />
                        <label
                            className={styles.checkboxLabel}
                            htmlFor={`checkbox_all_${filter}`}
                            onClick={resetFilter}>
                            All
                        </label>
                    </li>
                )}
                {sortedOptions.slice(0, listLimit).map((option, index) => (
                    <li key={index}>
                        <Input
                            type="checkbox"
                            id={`checkbox_${filter}_${option.value}`}
                            value={option.value}
                            data-filter={filter}
                            checked={isChecked(option.value)}
                            onChange={() => handleCheckboxChange(option.value)}
                        />
                        <label
                            className={styles.checkboxLabel}
                            htmlFor={`checkbox_${filter}_${option.value}`}>
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
