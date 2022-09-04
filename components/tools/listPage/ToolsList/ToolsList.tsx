import { FC } from 'react';
import {
    Dropdown,
    PanelHeader,
    LoadingCogs,
    SuggestLink,
    Button,
} from '@components/elements';
import { Tool, ToolCard } from '@components/tools';
import { useToolsQuery } from '@components/tools/queries/tools';
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
    currentTool?: string;
    overrideLanguages?: string[];
}

const ToolsList: FC<ToolsListProps> = ({
    currentTool: current_tool,
    overrideLanguages,
}) => {
    const { search, setSearch } = useSearchState();
    const routerPush = useRouterPush();
    const state = {
        ...search,
        languages: overrideLanguages || search.languages,
    };
    const toolsResult = useToolsQuery(state);
    if (
        toolsResult.isLoading ||
        toolsResult.isFetching ||
        toolsResult.isRefetching
    ) {
        return <LoadingCogs />;
    }
    if (toolsResult.error || !toolsResult.data) {
        return null;
    }

    // Exclude current tool from list of alternatives
    const sortedTools = toolsResult.data
        .filter((tool) => tool.name != current_tool)
        .sort(pickSort(state.sorting));

    const singleTagTools = sortedTools.filter(
        (tool) =>
            tool.languages.length === 1 ||
            (tool.languages.length === 0 && tool.other.length === 1),
    );
    // filter out all singleTagTools
    const multiTagTools = sortedTools.filter(
        (tool) => !singleTagTools.includes(tool),
    );
    const changeSort = (event: any) => {
        const sorting = event.target.value;
        setSearch({
            ...state,
            sorting,
        });
    };

    const shouldShowClearFilterButton =
        window.location.search !== '' && window.location.search !== '?';

    const resetSearch = () => {
        setSearch({});
        routerPush(`/tools`, undefined, {
            shallow: true,
        });
    };

    let singleTagHeading = `${singleTagTools.length} Static Analysis Tools`;
    const multiTagHeading = `${multiTagTools.length} Multi-Language Tools`;
    if (current_tool) {
        singleTagHeading = `Alternatives to ${current_tool}`;
    }

    return (
        <>
            <PanelHeader level={3} text={singleTagHeading}>
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
                {singleTagTools.map((tool, index) => (
                    <ToolCard key={index} tool={tool} />
                ))}
            </div>
            <PanelHeader level={3} text={multiTagHeading}></PanelHeader>
            <div>
                {multiTagTools.map((tool, index) => (
                    <ToolCard key={index} tool={tool} />
                ))}
            </div>
            <SuggestLink />
        </>
    );
};

export default ToolsList;
