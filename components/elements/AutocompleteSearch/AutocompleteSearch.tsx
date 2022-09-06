import { FC } from 'react';
import styles from './AutocompleteSearch.module.css';

import algoliasearch from 'algoliasearch/lite';
import {
    Configure,
    Highlight,
    Hits,
    InstantSearch,
    Pagination,
    SearchBox,
} from 'react-instantsearch-hooks-web';

const searchClient = algoliasearch(
    'V0X7Z4KE9D',
    '544bec33383dc791bcbca3e1ceaec11b',
);

// const searchClient = algoliasearch(
//     'B1G2GM9NG0',
//     'aadef574be1f9252bb48d4ea09b5cfe5',
// );

{
    /* <Input
    type="search"
    className={styles.autocompleteInput}
    name="search"
    placeholder="Find analysis tools, formatters, linters..."
/>; */
}

function Hit({ hit }) {
    return (
        <article>
            <h1>
                <Highlight attribute="name" hit={hit} />
            </h1>
        </article>
    );
}

const AutocompleteSearch: FC = () => {
    // const box = searchBox({
    //     container: '#searchbox',
    //     // Optional parameters
    //     // placeholder: string,
    //     // autofocus: boolean,
    //     // searchAsYouType: boolean,
    //     // showReset: boolean,
    //     // showSubmit: boolean,
    //     // showLoadingIndicator: boolean,
    //     // queryHook: function,
    //     // templates: object,
    //     // cssClasses: object,
    // });

    return (
        <InstantSearch searchClient={searchClient} indexName="tools">
            <>
                <Configure hitsPerPage={10} typoTolerance={true} />
                {/* {box} */}
                <SearchBox
                    className={styles.autocompleteInput}
                    placeholder="Find analysis tools, formatters, linters.."
                />
                {/* <Hits hitComponent={Hit} /> */}
                {/* <Pagination /> */}
            </>
        </InstantSearch>
    );
};

export default AutocompleteSearch;
