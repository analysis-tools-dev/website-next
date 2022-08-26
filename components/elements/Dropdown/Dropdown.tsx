import { Card } from '@components/layout';
import { FC } from 'react';
import styles from './Dropdown.module.css';

interface DropdownProps {
    changeSort: (searchState: any) => void;
}

const Dropdown: FC<DropdownProps> = ({ changeSort }) => {
    return (
        <Card className={styles.selectWrapper}>
            <label className={styles.label} htmlFor="sort-select">
                Sort by:{' '}
            </label>
            <select
                className={styles.select}
                onChange={changeSort}
                id="sort-select">
                <optgroup label="Votes">
                    <option value="votes_desc">Votes Desc</option>
                    <option value="votes_asc">Votes Asc</option>
                </optgroup>
                <optgroup label="Alphabetical">
                    <option value="alphabetical_asc">Alphabetical Asc</option>
                    <option value="alphabetical_desc">Alphabetical Desc</option>
                </optgroup>
            </select>
        </Card>
    );
};

export default Dropdown;
