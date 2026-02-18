import { FC, useState } from 'react';
import { Button, Input } from '@components/elements';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';

import styles from './LanguageFilterCard.module.css';
import { useTools, type SearchFilter } from 'context/ToolsProvider';
import classNames from 'classnames';

export interface LanguageFilterOption {
    value: string;
    name: string;
    tag_type?: string;
    results?: number;
}

export interface LanguageFilterCardProps {
    heading: string;
    showAllCheckbox?: boolean;
    filter: string;
    options: LanguageFilterOption[];
    limit?: number;
    className?: string;
}

const LanguageFilterCard: FC<LanguageFilterCardProps> = ({
    heading,
    showAllCheckbox,
    filter,
    options,
    limit = 10,
    className,
}) => {
    const {
        search,
        toggleFilter,
        updateFilter,
        isSelected,
        getLanguageCount,
        allTools,
    } = useTools();

    const shouldShowToggle = options.length > limit;
    const [listLimit, setLimit] = useState(limit);

    // Fade out background when not showing all options
    const [faded, setFaded] = useState(styles.faded);

    const toggleAll = () => {
        if (listLimit === 999) {
            setLimit(limit);
            setFaded(styles.faded);
        } else {
            setLimit(999);
            setFaded('normal');
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

    // Sort options: checked items first, then by count
    const sortedOptions = [...options].sort((a, b) => {
        const aChecked = isChecked(a.value);
        const bChecked = isChecked(b.value);
        if (aChecked && !bChecked) return -1;
        if (!aChecked && bChecked) return 1;
        // Then sort by count
        const aCount = getLanguageCount(a.value);
        const bCount = getLanguageCount(b.value);
        return bCount - aCount;
    });

    // Filter to only show languages that have tools
    const filteredOptions = sortedOptions.filter((option) => {
        return allTools.some((tool) => tool.languages?.includes(option.value));
    });

    // Don't fade out background if the list is short
    let listClassNames = classNames(styles.checklist);
    if (shouldShowToggle) {
        listClassNames = classNames(styles.checklist, faded);
    }

    return (
        <Card className={classNames(className)}>
            <Heading level={3} className="m-b-16 font-bold">
                {heading}
            </Heading>

            <ul className={listClassNames}>
                {showAllCheckbox ? (
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
                ) : null}
                {filteredOptions.slice(0, listLimit).map((option, index) => {
                    const count = getLanguageCount(option.value);
                    return (
                        <li key={index}>
                            <Input
                                type="checkbox"
                                id={`checkbox_${filter}_${option.value}`}
                                value={option.value}
                                data-filter={filter}
                                checked={isChecked(option.value)}
                                onChange={() =>
                                    handleCheckboxChange(option.value)
                                }
                            />
                            <label
                                className={styles.checkboxLabel}
                                htmlFor={`checkbox_${filter}_${option.value}`}>
                                {option.name}{' '}
                                <span className={styles.toolsCount}>
                                    ({count})
                                </span>
                            </label>

                            {option.results ? (
                                <label className={styles.optionResults}>
                                    {option.results}
                                </label>
                            ) : null}
                        </li>
                    );
                })}
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

export default LanguageFilterCard;
