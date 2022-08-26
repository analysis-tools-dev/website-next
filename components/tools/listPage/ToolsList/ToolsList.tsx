import { FC } from 'react';
import {
    Dropdown,
    PanelHeader,
    LoadingCogs,
    SuggestLink,
} from '@components/elements';
import { Tool, ToolCard } from '@components/tools';
import { useToolsQuery } from '@components/tools/queries/tools';
import { SearchState, useSearchState } from 'context/SearchProvider';

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
    heading: string;
    currentTool?: string;
    overrideLanguages?: string[];
}

const ToolsList: FC<ToolsListProps> = ({
    heading,
    currentTool: current_tool,
    overrideLanguages,
}) => {
    const { search, setSearch } = useSearchState();
    const state = {
        ...search,
        languages: overrideLanguages || search.languages,
    };
    console.log(JSON.stringify(state));
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

    const singleLanguageTools = sortedTools.filter(
        (tool) => tool.languages.length === 1,
    );
    const multiLanguageTools = sortedTools.filter(
        (tool) => tool.languages.length > 1,
    );
    const changeSort = (event: any) => {
        const sorting = event.target.value;
        setSearch({
            ...state,
            sorting,
        });
    };

    return (
        <>
            <PanelHeader level={3} text={heading}>
                {/* <Link href="/tools">{`Show all (${tools.length})`}</Link> */}
                <Dropdown changeSort={changeSort} />
            </PanelHeader>
            <div>
                {singleLanguageTools.map((tool, index) => (
                    <ToolCard key={index} tool={tool} />
                ))}
            </div>
            <PanelHeader level={3} text="Multi-Language Tools"></PanelHeader>
            <div>
                {multiLanguageTools.map((tool, index) => (
                    <ToolCard key={index} tool={tool} />
                ))}
            </div>
            <SuggestLink />
        </>
    );
};

export default ToolsList;
