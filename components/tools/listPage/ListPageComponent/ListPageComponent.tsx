import { Dropdown, LoadingDots, PanelHeader } from '@components/elements';
import { Panel } from '@components/layout';
import { MobileFilters, Tool, ToolCard, ToolsSidebar } from '@components/tools';
import { useSearchState } from 'context/SearchProvider';
import { useRouterPush } from 'hooks';
import { FC, useCallback, useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import { objectToQueryString } from 'utils/query';
import { Article } from 'utils/types';

const DEAULT_LIST_LIMIT = 50;

export interface ListComponentProps {
    articles: Article[];
}
const ListComponent: FC<ListComponentProps> = ({ articles }) => {
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
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    });

    const routerPush = useRouterPush();

    // Handle infinite scroll element intersection
    const handleObserver = useCallback(
        (entries: any) => {
            const [target] = entries;
            if (target.isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage],
    );

    // Udpate the search state when the query changes and refetch
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

    return (
        <>
            <ToolsSidebar articles={articles} />
            <Panel>
                <PanelHeader level={3} text={heading}>
                    {/* <Dropdown changeSort={changeSort} /> */}
                    <MobileFilters />
                </PanelHeader>
                {data?.pages?.map((page, i) => {
                    return page.data
                        ? page.data.map((tool: Tool, index: number) => (
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
