import { FC, useState } from 'react';
import Link from 'next/link';
import { Button, Input } from '@components/elements';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';

import styles from './FilterCard.module.css';

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

// TODO: Add click functionality and debounce
// TODO: Clicking All resets other checkboxes
// TODO: Clicking Show all removes slice
const FilterCard: FC<FilterCardProps> = ({ heading, options, limit = 10 }) => {
    const [listLimit, setLimit] = useState(limit);

    const toggleAll = () => {
        if (listLimit === 999) {
            setLimit(limit);
        } else {
            setLimit(999);
        }
    };

    const shouldShowToggle = options.length > limit;
    return (
        <Card className="m-b-30">
            <Heading level={3} className="m-b-16 font-bold">
                {heading}
            </Heading>

            <ul className={styles.checklist}>
                <li>
                    <Input type="checkbox" id="checkbox_all" />
                    <label
                        className={styles.checkboxLabel}
                        htmlFor="checkbox_all">
                        All
                    </label>
                </li>
                {options.slice(0, listLimit).map((option, index) => (
                    <li key={index}>
                        <Input type="checkbox" id={`checkbox_${option.tag}`} />
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
