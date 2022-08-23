import { Card } from '@components/layout';
import { FC, useState } from 'react';
import styles from './Dropdown.module.css';
import Select from 'react-select';

interface DropdownProps {
    selectedOption: any;
    options: any;
    changeSorting: any;
}

const Dropdown: FC<DropdownProps> = ({
    selectedOption,
    options,
    changeSorting,
}) => {
    return (
        <Card className={styles.selectWrapper}>
            <label className={styles.label} htmlFor="sort-select">
                Sort by:{' '}
            </label>
            <select
                className={styles.select}
                id="sort-select"
                onChange={(e) => changeSorting(e.target.value)}>
                defaultValue={selectedOption}
                options={options}
            </select>
        </Card>
    );
};

export default Dropdown;
