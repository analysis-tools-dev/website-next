import { FC, useState } from 'react';
import Link from 'next/link';
import { Button, Input } from '@components/elements';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';

import styles from './FilterCard.module.css';
import { useRouter } from 'next/router';
import { objectToQueryString } from 'utils';

interface FilterOption {
    tag: string;
    name: string;
    results?: number;
}

export interface FilterCardProps {
    heading: string;
    param: string;
    options: FilterOption[];
    limit?: number;
}

const INITIAL_FILTER_STATE: Record<string, string[]> = {};

// TODO: Add click functionality and debounce
// TODO: Clicking All resets other checkboxes
// TODO: Clicking Show all removes slice
const FilterCard: FC<FilterCardProps> = ({
    heading,
    param,
    options,
    limit = 10,
}) => {
    const router = useRouter();

    const [listLimit, setLimit] = useState(limit);
    const [filters, setFilters] = useState(router.query);

    const toggleAll = () => {
        if (listLimit === 999) {
            setLimit(limit);
        } else {
            setLimit(999);
        }
    };

    const selectFilter = (value: string | undefined) => {
        const filterValue = value || '';
        const filterSate = filters[param];
        if (filterSate) {
            if (Array.isArray(filterSate)) {
                const selectedIndex = filterSate.indexOf(filterValue);
                if (selectedIndex > -1) {
                    setFilters({
                        ...filters,
                        [param]: [],
                    });
                } else {
                    setFilters({
                        ...filters,
                        [param]: [...filterSate, filterValue],
                    });
                    // filterSate.push(value);
                }
            } else {
                if (filterSate.includes(filterValue)) {
                    setFilters({
                        ...filters,
                        [param]: [],
                    });
                } else {
                    setFilters({
                        ...filters,
                        [param]: [filterSate, filterValue],
                    });
                }
            }
            router.query = filters;
            // setFilters(router.query);
            router.push(
                `/tools?${objectToQueryString(router.query)}`,
                undefined,
                {
                    shallow: true,
                },
            );
        } else {
            router.query[param] = filterValue;
            setFilters(router.query);
            router.push(
                `/tools?${objectToQueryString(router.query)}`,
                undefined,
                {
                    shallow: true,
                },
            );
        }

        // let paramFilter = router.query[param] || '';
        // if (value && paramFilter) {
        //     if (Array.isArray(paramFilter)) {
        //         const selectedIndex = paramFilter.indexOf(value);
        //         if (selectedIndex > -1) {
        //             paramFilter.splice(selectedIndex, 1);
        //         } else {
        //             paramFilter.push(value);
        //         }
        //     } else {
        //         if (paramFilter.includes(value)) {
        //             paramFilter = '';
        //         } else {
        //             paramFilter = [paramFilter, value];
        //         }
        //     }

        //     router.query[param] = paramFilter;
        //     router.push(
        //         `/tools?${objectToQueryString(router.query)}`,
        //         undefined,
        //         { shallow: true },
        //     );
        // } else {
        //     console.log(value);
        //     console.log(paramFilter);
        //     console.log('!!!!!!!!!!! HIT ELSE');
        // }
    };

    const shouldShowToggle = options.length > limit;
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
                        data-value="all"
                        onChange={(e) => console.log(e)}
                    />
                    <label
                        className={styles.checkboxLabel}
                        htmlFor="checkbox_all">
                        All
                    </label>
                </li>
                {options.slice(0, listLimit).map((option, index) => (
                    <li key={index}>
                        <Input
                            type="checkbox"
                            id={`checkbox_${option.tag}`}
                            data-value={option.tag}
                            checked={router.query[param]?.includes(option.tag)}
                            onChange={(e) =>
                                selectFilter(e.target.dataset.value)
                            }
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
                    {listLimit === 999 ? 'Show less' : 'Show all'}
                </Button>
            ) : null}
        </Card>
    );
};

export default FilterCard;
