import { FC, useState } from 'react';
import Link from 'next/link';
import algoliasearch from 'algoliasearch/lite';
import {
    Configure,
    Highlight,
    Hits,
    InstantSearch,
    Pagination,
    SearchBox,
} from 'react-instantsearch-hooks-web';
import { Card } from '@components/layout';
import classNames from 'classnames';
import { AlgoliaSearchHelper } from 'algoliasearch-helper';
import { useDocumentEvent } from 'hooks';

const configLoaded =
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY;

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || '',
);

interface SearchResult {
    hit: any;
    sendEvent: any;
}

const Hit = (result: SearchResult) => {
    return (
        <Link href={result.hit.fields.slug} passHref>
            <Highlight attribute="name" hit={result.hit} />
        </Link>
    );
};

const AutocompleteSearch: FC = () => {
    const [showResults, setShow] = useState(false);

    const handleShowResults = (e: any) => {
        if (!!e.target.value) {
            setShow(true);
        }
    };

    const handleSearch = (e: AlgoliaSearchHelper) => {
        const shouldShow =
            e.state.query && e.state.query.length > 0 ? true : false;
        setShow(shouldShow);
        if (shouldShow) {
            e.search();
        }
    };

    const handleHideDropdown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setShow(false);
        }
    };

    const handleClickOutside = (event: any) => {
        if (
            event.path &&
            !event.path.find(
                (el: any) => el.className === 'autocomplete-search',
            )
        ) {
            setShow(false);
        }
    };

    useDocumentEvent([
        { type: 'click', callback: handleClickOutside },
        { type: 'keydown', callback: handleHideDropdown },
    ]);

    return configLoaded ? (
        <InstantSearch
            searchClient={searchClient}
            indexName="tools"
            searchFunction={handleSearch}>
            <div className="autocomplete-search">
                <Configure hitsPerPage={10} typoTolerance={true} />
                <SearchBox
                    placeholder="Find analysis tools, formatters, linters.."
                    onFocus={handleShowResults}
                />
                <div className="relative">
                    <Card
                        className={classNames('search-results', {
                            hidden: !showResults,
                        })}>
                        <Hits hitComponent={Hit} />
                        <Pagination />
                    </Card>
                </div>
            </div>
        </InstantSearch>
    ) : null;
};

export default AutocompleteSearch;
