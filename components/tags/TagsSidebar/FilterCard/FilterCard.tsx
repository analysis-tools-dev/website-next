import { FC } from 'react';
import { Input } from '@components/elements';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import { FilterKey, OnFilterChange } from '@components/tags/types';

import styles from './FilterCard.module.css';
import classNames from 'classnames';

export interface FilterOption {
    value: string;
    name: string;
    tag_type?: string;
}

export interface FilterCardProps {
    heading: string;
    filter: FilterKey;
    options: FilterOption[];
    className?: string;
    onFilterChange: OnFilterChange;
}

const FilterCard: FC<FilterCardProps> = ({
    heading,
    filter,
    options,
    className,
    onFilterChange,
}) => {
    return (
        <Card className={classNames(className)}>
            <Heading level={3} className="m-b-16 font-bold">
                {heading}
            </Heading>

            <ul className={styles.checklist}>
                {options.map((option, index) => (
                    <li key={index}>
                        <label
                            className={styles.checkboxLabel}
                            htmlFor={`checkbox_${option.value}`}>
                            <Input
                                type="checkbox"
                                id={`checkbox_${option.value}`}
                                onChange={(e) =>
                                    onFilterChange(
                                        filter,
                                        option.value,
                                        e.target.checked,
                                    )
                                }
                                tabIndex={0}
                            />
                            {option.name}
                        </label>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default FilterCard;
