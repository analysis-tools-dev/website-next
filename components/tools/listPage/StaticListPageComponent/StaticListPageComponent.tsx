import { FC, useState, useEffect } from 'react';
import { Button, Dropdown, PanelHeader } from '@components/elements';
import { Panel } from '@components/layout';
import { MobileFilters, ToolCard, ToolsSidebar } from '@components/tools';
import { useTools, type SortOption } from 'context/ToolsProvider';
import { type ArticlePreview } from 'utils/types';
import { FilterOption } from '../ToolsSidebar/FilterCard/FilterCard';
import { LanguageFilterOption } from '../ToolsSidebar/FilterCard/LanguageFilterCard';
import styles from './StaticListPageComponent.module.css';

const DEFAULT_PAGE_SIZE = 50;

export interface StaticListComponentProps {
    languages: LanguageFilterOption[];
    others: FilterOption[];
    articles: ArticlePreview[];
}

const StaticListComponent: FC<StaticListComponentProps> = ({
    languages,
    others,
    articles,
}) => {
    const heading = `Static Analysis Tools`;
    const { tools, search, clearFilters, setSorting, totalCount } = useTools();

    // Simple client-side pagination with "Load More"
    const [displayCount, setDisplayCount] = useState(DEFAULT_PAGE_SIZE);

    // Reset display count when filters change
    const searchKey = JSON.stringify(search);
    useEffect(() => {
        setDisplayCount(DEFAULT_PAGE_SIZE);
    }, [searchKey]);

    const displayedTools = tools.slice(0, displayCount);
    const hasMore = displayCount < totalCount;

    const loadMore = () => {
        setDisplayCount((prev) => prev + DEFAULT_PAGE_SIZE);
    };

    const changeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const sorting = e.target.value as SortOption;
        setSorting(sorting);
    };

    const resetSearch = () => {
        clearFilters();
    };

    // Show clear filter button if there are any filters applied
    const shouldShowClearFilterButton =
        Object.keys(search).filter((key) => key !== 'sorting').length > 0;

    return (
        <>
            <ToolsSidebar
                languages={languages}
                others={others}
                articles={articles}
            />
            <Panel>
                <PanelHeader level={3} text={heading}>
                    <span className={styles.resultsCount}>
                        {totalCount} tools
                    </span>
                    {shouldShowClearFilterButton ? (
                        <Button
                            className={styles.clearButton}
                            onClick={resetSearch}
                            theme="primary">
                            Clear All Filters
                        </Button>
                    ) : null}
                    <Dropdown
                        className="mobileHidden"
                        changeSort={changeSort}
                    />
                    <MobileFilters languages={languages} others={others} />
                </PanelHeader>
                {displayedTools.map((tool, index) => (
                    <ToolCard key={`tool-${tool.id}-${index}`} tool={tool} />
                ))}
                {hasMore && (
                    <div className={styles.loadMoreContainer}>
                        <Button onClick={loadMore} theme="secondary">
                            Load More ({totalCount - displayCount} remaining)
                        </Button>
                    </div>
                )}
            </Panel>
        </>
    );
};

export default StaticListComponent;
