import { FC, useState } from 'react';
import { withRouter, type Router } from 'next/router';
import { Button, Input } from '@components/elements';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';

import styles from './LanguageFilterCard.module.css';
import { SearchFilter, useSearchState } from 'context/SearchProvider';
import { isChecked, isSelectedFilter, sortByChecked } from './utils';
import { changeQuery } from 'utils/query';
import { useToolsQuery } from '@components/tools/queries';
import classNames from 'classnames';
import { isArray } from 'util';

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
    router: Router;
    className?: string;
}

// TODO: Add Toggle Deprecated (default off)
// TODO: Add click functionality and debounce
const LanguageFilterCard: FC<LanguageFilterCardProps> = ({
    heading,
    showAllCheckbox,
    filter,
    options,
    limit = 10,
    className,
}) => {
    const { search, setSearch } = useSearchState();

    const shouldShowToggle = options.length > limit;
    const [listLimit, setLimit] = useState(limit);

    // Fade out background when not showing all options
    const [faded, setFaded] = useState(styles.faded);

    const { data: toolsResult } = useToolsQuery(search);
    if (!toolsResult || !toolsResult.data || !isArray(toolsResult.data)) {
        return null;
    }
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
        if (search[searchFilter]) {
            delete search[searchFilter];
        }
        setSearch({ ...search });
    };

    if (options.length > limit) {
        options.sort(sortByChecked(filter, search));
    }

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
                ) : null}
                {options
                    .filter((option) => {
                        // check if any tool has this language
                        return toolsResult.data?.some((tool) => {
                            return tool.languages.includes(option.value);
                        });
                    })
                    .slice(0, listLimit)
                    .map((option, index) => (
                        <li key={index}>
                            <Input
                                type="checkbox"
                                id={`checkbox_${option.value}`}
                                value={option.value}
                                data-filter={filter}
                                checked={isChecked(
                                    filter,
                                    option.value,
                                    search,
                                )}
                                onChange={changeQuery(
                                    option.value,
                                    search,
                                    setSearch,
                                )}
                            />
                            <label
                                className={styles.checkboxLabel}
                                htmlFor={`checkbox_${option.value}`}>
                                {option.name}{' '}
                                <span className={styles.toolsCount}>
                                    (
                                    {
                                        toolsResult.data.filter((tool) => {
                                            return tool.languages.includes(
                                                option.value,
                                            );
                                        }).length
                                    }
                                    )
                                </span>
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

export default withRouter(LanguageFilterCard);
