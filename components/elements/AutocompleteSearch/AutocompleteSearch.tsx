import { FC } from 'react';
import styles from './AutocompleteSearch.module.css';
import { Input } from '@components/elements';

const AutocompleteSearch: FC = () => {
    return (
        <Input
            type="search"
            className={styles.autocompleteInput}
            name="search"
            placeholder="Find analysis tools, formatters, linters..."
        />
    );
};

export default AutocompleteSearch;
