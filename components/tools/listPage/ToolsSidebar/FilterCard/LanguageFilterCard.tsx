import { FC, useEffect, useState } from 'react';
import { withRouter, type Router } from 'next/router';
import { Button, Input } from '@components/elements';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';

import styles from './LanguageFilterCard.module.css';
import { objectToQueryString } from 'utils/query';
import { useRouterPush } from 'hooks';
import { SearchFilter, useSearchState } from 'context/SearchProvider';
import { isChecked, isSelectedFilter, sortByChecked } from './utils';
import { changeQuery } from 'utils/query';
import { useToolsQuery } from '@components/tools/queries';
import classNames from 'classnames';

export interface LanguageFilterOption {
    tag: string;
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
}

// TODO: Add Toggle Deprecated (default off)
// TODO: Add click functionality and debounce
const LanguageFilterCard: FC<LanguageFilterCardProps> = ({
    heading,
    showAllCheckbox,
    filter,
    options,
    limit = 10,
}) => {
    const { search, setSearch } = useSearchState();

    const routerPush = useRouterPush();

    useEffect(() => {
        if (Object.keys(search).length) {
            routerPush(`/tools?${objectToQueryString(search)}`, undefined, {
                shallow: true,
            });
        }
    }, [search, routerPush]);

    const shouldShowToggle = options.length > limit;
    const [listLimit, setLimit] = useState(limit);

    // Fade out background when not showing all options
    const [faded, setFaded] = useState(styles.faded);

    const toolsResult = useToolsQuery(search);
    if (toolsResult.error || !toolsResult.data) {
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

        routerPush(`/tools?${objectToQueryString(search)}`, undefined, {
            shallow: true,
        });
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
        <Card>
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
                        return toolsResult.data.some((tool) => {
                            return tool.languages.includes(option.tag);
                        });
                    })
                    .slice(0, listLimit)
                    .map((option, index) => (
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
                                {option.name}{' '}
                                <span className={styles.toolsCount}>
                                    (
                                    {
                                        toolsResult.data.filter((tool) => {
                                            return tool.languages.includes(
                                                option.tag,
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
