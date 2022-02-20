import { FC } from 'react';
import Link from 'next/link';
import { Input } from '@components/elements';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';

import styles from './FilterCard.module.css';

interface FilterOption {
    id: string;
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
    return (
        <Card className="m-b-30">
            <Heading level={2} className="m-b-16 font-bold">
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
                {options.slice(0, limit).map((option, index) => (
                    <li key={index}>
                        <Input type="checkbox" id={`checkbox_${option.id}`} />
                        <label
                            className={styles.checkboxLabel}
                            htmlFor={`checkbox_${option.id}`}>
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
            <Link href="/blog">
                <a className="centered font-light font-size-15 underline">
                    Show all
                </a>
            </Link>
        </Card>
    );
};

export default FilterCard;
