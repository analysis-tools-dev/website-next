import { FC } from 'react';
import { Dropdown, PanelHeader, LoadingCogs } from '@components/elements';
import { type Tool } from '@components/tools/types';
import { ToolCard } from '@components/tools';
import { useToolsQuery } from '@components/tools/queries/tools';
import { SearchState, useSearchSate } from 'context/SearchProvider';

interface ToolsListProps {
    heading: string;
    overrideSearch?: SearchState;
}

function compare(a: Tool, b: Tool) {
    if (a.votes > b.votes) {
        return -1;
    }
    if (a.votes < b.votes) {
        return 1;
    }
    return 0;
}

const ToolsList: FC<ToolsListProps> = ({ heading, overrideSearch }) => {
    const { search } = useSearchSate();
    const state = overrideSearch ? overrideSearch : search;
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
    const sortedTools = toolsResult.data.sort(compare);
    return (
        <>
            <PanelHeader level={3} text={heading}>
                {/* <Link href="/tools">{`Show all (${tools.length})`}</Link> */}
                {/* TODO: Add sorting */}
                <Dropdown />
            </PanelHeader>
            <div>
                {sortedTools.map((tool, index) => (
                    <ToolCard key={index} tool={tool} />
                ))}
            </div>
        </>
    );
};

export default ToolsList;
