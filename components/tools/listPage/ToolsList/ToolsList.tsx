import { FC } from 'react';
import { checkArraysIntersect } from 'utils/arrays';
import {
    Dropdown,
    PanelHeader,
    SuggestLink,
    Button,
} from '@components/elements';
import { Tool, ToolCard } from '@components/tools';
import { useRouterPush } from 'hooks';
import { useSearchState } from 'context/SearchProvider';
import styles from './ToolsList.module.css';

const pickSort = (sort: string) => {
    switch (sort) {
        case 'votes_asc':
            return (a: Tool, b: Tool) => a.votes - b.votes;
        case 'alphabetical_asc':
            return (a: Tool, b: Tool) => a.name.localeCompare(b.name);
        case 'alphabetical_desc':
            return (a: Tool, b: Tool) => b.name.localeCompare(a.name);
        default:
            return (a: Tool, b: Tool) => b.votes - a.votes;
    }
};

interface ToolsListProps {
    tools: Tool[];
}

const ToolsList: FC<ToolsListProps> = ({ tools }) => {
    // const shouldShowClearFilterButton =
    //     window.location.search !== '' && window.location.search !== '?';
    const shouldShowClearFilterButton = false;
    const { search, setSearch } = useSearchState();
    const routerPush = useRouterPush();
    const state = {
        ...search,
    };

    const sortedTools = tools.sort(pickSort(state.sorting));

    let singleTagTools = sortedTools.filter(
        (tool) =>
            tool.languages.length === 1 ||
            (tool.languages.length === 0 && tool.other.length === 1),
    );
    // filter out all singleTagTools
    let multiTagTools = sortedTools.filter(
        (tool) => !singleTagTools.includes(tool),
    );

    // if in currentTool view, show only tools with the same type
    singleTagTools = singleTagTools.filter(
        (tool) =>
            checkArraysIntersect(tool.types, tool.types || []) &&
            checkArraysIntersect(tool.categories, tool.categories || []),
    );
    multiTagTools = multiTagTools.filter(
        (tool) =>
            checkArraysIntersect(tool.types, tool.types || []) &&
            checkArraysIntersect(tool.categories, tool.categories || []),
    );

    let singleTagHeading = `${singleTagTools.length} Static Analysis Tools`;
    const multiTagHeading = `${multiTagTools.length} Multi-Language Tools`;
    singleTagHeading = `Alternatives Tools`;

    // const toolsResult = useToolsQuery(state);
    // if (
    //     toolsResult.isLoading ||
    //     toolsResult.isFetching ||
    //     toolsResult.isRefetching
    // ) {
    //     return <LoadingCogs />;
    // }
    // if (toolsResult.error || !toolsResult.data) {
    //     return null;
    // }

    const changeSort = (event: any) => {
        const sorting = event.target.value;
        setSearch({
            ...state,
            sorting,
        });
    };

    const resetSearch = () => {
        setSearch({});
        routerPush(`/tools`, undefined, {
            shallow: true,
        });
    };

    const single = singleTagHeading || 'Single Language Tools';
    const multi = multiTagHeading || 'Multi Language Tools';

    return (
        <>
            <PanelHeader level={3} text={single}>
                {/* <Link href="/tools">{`Show all (${tools.length})`}</Link> */}
                {shouldShowClearFilterButton ? (
                    <Button
                        className={styles.clearButton}
                        onClick={resetSearch}
                        theme="secondary">
                        Clear All Filters
                    </Button>
                ) : null}
                <Dropdown changeSort={changeSort} />
            </PanelHeader>
            <div>
                {singleTagTools &&
                    singleTagTools.map((tool, index) => (
                        <ToolCard key={index} tool={tool} />
                    ))}
            </div>
            {multiTagTools && multiTagTools.length > 0 && (
                <>
                    <PanelHeader level={3} text={multi}></PanelHeader>
                    <div>
                        {multiTagTools.map((tool, index) => (
                            <ToolCard key={index} tool={tool} />
                        ))}
                    </div>
                </>
            )}
            <SuggestLink />
        </>
    );
};

export default ToolsList;
