import {
    Button,
    Dropdown,
    LoadingDots,
    PanelHeader,
} from '@components/elements';
import { Panel } from '@components/layout';
import { MobileFilters, Tool, ToolCard, ToolsSidebar } from '@components/tools';
import { useSearchState } from 'context/SearchProvider';
import { useRouterPush } from 'hooks';
import { FC, useCallback, useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import { objectToQueryString } from 'utils/query';
import { type ArticlePreview } from 'utils/types';
import { FilterOption } from '../ToolsSidebar/FilterCard/FilterCard';
import { LanguageFilterOption } from '../ToolsSidebar/FilterCard/LanguageFilterCard';
import styles from './ListPageComponent.module.css';

const DEAULT_LIST_LIMIT = 50;

export interface ListComponentProps {
    languages: LanguageFilterOption[];
    others: FilterOption[];
    articles: ArticlePreview[];
}
const ListComponent: FC<ListComponentProps> = ({
    languages,
    others,
    articles,
}) => {
    const heading = `Static Analysis Tools`;

    const observerElem = useRef(null);
    const { search, setSearch } = useSearchState();

    const fetchTools = async ({ pageParam = 0 }) => {
        const apiURL =
            '/api/paginated-tools?' +
            objectToQueryString(search) +
            '&limit=' +
            DEAULT_LIST_LIMIT +
            '&offset=' +
            pageParam;
        const res = await fetch(apiURL);
        return res.json();
    };

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['paginated-tools'],
        queryFn: fetchTools,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const routerPush = useRouterPush();

    // Handle infinite scroll element intersection
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries;
            if (target.isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage],
    );

    // Update the search state when the query changes and refetch
    useEffect(() => {
        // Update query params in router
        routerPush(`/tools?${objectToQueryString(search)}`, undefined, {
            shallow: true,
        });
        refetch();
    }, [refetch, routerPush, search]);

    // Fetch next page when the infinite scroll element is in view
    useEffect(() => {
        const element = observerElem.current;
        const option = { threshold: 0 };

        if (element) {
            const observer = new IntersectionObserver(handleObserver, option);
            observer.observe(element);
            return () => observer.unobserve(element);
        }
    }, [fetchNextPage, hasNextPage, handleObserver, routerPush, search]);

    if (error) {
        return null;
    }

    const changeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const sorting = e.target.value;
        setSearch({
            ...search,
            sorting,
        });
    };

    const resetSearch = () => {
        setSearch({});
        routerPush(`/tools`, undefined, {
            shallow: true,
        });
    };

    // Show clear filter button if there are any filters applied
    const shouldShowClearFilterButton = Object.keys(search).length > 0;

    return (
        <>
            <ToolsSidebar
                languages={languages}
                others={others}
                articles={articles}
            />
            <Panel>
                <PanelHeader level={3} text={heading}>
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
                    <MobileFilters />
                </PanelHeader>
                {data?.pages?.map((page, i) => {
                    return page.data
                        ? page.data.data.map((tool: Tool, index: number) => (
                              <ToolCard
                                  key={`tool-${i}-${index}`}
                                  tool={tool}
                              />
                          ))
                        : null;
                })}
                <div ref={observerElem}>
                    {isFetchingNextPage && hasNextPage ? <LoadingDots /> : null}
                </div>
            </Panel>
        </>
    );
};

export default ListComponent;
