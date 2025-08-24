import { FC, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import algoliasearch from 'algoliasearch/lite';
import {
    Configure,
    Highlight,
    Hits,
    InstantSearch,
    useSearchBox,
} from 'react-instantsearch';
import type { Hit, BaseHit } from 'instantsearch.js';
import { Card } from '@components/layout';
import classNames from 'classnames';

const searchClient = algoliasearch(
    'V0X7Z4KE9D',
    '544bec33383dc791bcbca3e1ceaec11b',
);

interface ToolHit extends Hit<BaseHit> {
    fields: {
        slug: string;
        name: string;
    };
}

interface SearchResult {
    hit: ToolHit;
    sendEvent: (eventType: string, hit: ToolHit, eventName?: string) => void;
}

const Hit = (result: SearchResult) => {
    return (
        <Link href={result.hit.fields.slug} passHref>
            <Highlight attribute="name" hit={result.hit} />
        </Link>
    );
};

const CustomSearchBox: FC<{
    onFocus: () => void;
    onChange: (query: string) => void;
}> = ({ onFocus, onChange }) => {
    const { query, refine } = useSearchBox();

    return (
        <div className="ais-SearchBox">
            <input
                type="search"
                placeholder="Find analysis tools, formatters, linters.."
                value={query}
                onFocus={onFocus}
                onChange={(e) => {
                    refine(e.target.value);
                    onChange(e.target.value);
                }}
                className="ais-SearchBox-input"
            />
        </div>
    );
};

const AutocompleteSearch: FC = () => {
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <InstantSearch searchClient={searchClient} indexName="tools">
            <div className="autocomplete-search" ref={searchRef}>
                <Configure hitsPerPage={10} typoTolerance={true} />
                <CustomSearchBox
                    onFocus={() => setShowResults(true)}
                    onChange={(query) => setShowResults(query.length > 0)}
                />
                <div className="relative">
                    <Card
                        className={classNames('search-results', {
                            hidden: !showResults,
                        })}>
                        <Hits hitComponent={Hit} />
                    </Card>
                </div>
            </div>
        </InstantSearch>
    );
};

export default AutocompleteSearch;
