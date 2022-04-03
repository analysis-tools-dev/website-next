import { FC, useEffect, useState } from 'react';
import { withRouter, type Router } from 'next/router';
import { Button, Input } from '@components/elements';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';

import styles from './FilterCard.module.css';
import { getParamAsArray, objectToQueryString } from 'utils';
import { useRouterPush } from 'hooks';

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
    router: Router;
}

// TODO: Add click functionality and debounce
// TODO: Clicking All resets other checkboxes
// TODO: Clicking Show all removes slice
const FilterCard: FC<FilterCardProps> = ({
    heading,
    param,
    options,
    limit = 10,
    router,
}) => {
    const [query, setQuery] = useState(router.query);
    const routerPush = useRouterPush();

    const [listLimit, setLimit] = useState(limit);
    const toggleAll = () => {
        if (listLimit === 999) {
            setLimit(limit);
        } else {
            setLimit(999);
        }
    };
    const shouldShowToggle = options.length > limit;

    const changeQuery = (val: string) => (e: any) => {
        const key = e.target.dataset.filter;
        const currValue = getParamAsArray(query, key);
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
        console.log(query);
        setQuery({ ...query, [key]: currValue?.join(',') });
        console.log(query);
    };
    useEffect(() => {
        routerPush(`/tools?${objectToQueryString(query)}`, undefined, {
            shallow: true,
        });
    }, [query, routerPush]);

    const isChecked = (key: string, value: string) => {
        const param = getParamAsArray(query, key);
        return param.includes(value) ? true : false;
    };
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
                        data-filter={param}
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
                            value={option.tag}
                            data-filter={param}
                            checked={isChecked(param, option.tag)}
                            onChange={changeQuery(option.tag)}
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

export default withRouter(FilterCard);
