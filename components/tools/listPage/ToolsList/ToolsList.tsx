import { FC } from 'react';
import {
    Dropdown,
    PanelHeader,
    LoadingCogs,
    SuggestLink,
} from '@components/elements';
import { ToolCard } from '@components/tools';
import { useToolsQuery } from '@components/tools/queries/tools';
import { SearchState, useSearchSate } from 'context/SearchProvider';
import { sortByVote } from 'utils/votes';

interface ToolsListProps {
    heading: string;
    current_tool?: string;
    overrideSearch?: SearchState; //FIXME: Change to be filters: Language, ToolID,etc..
}

const ToolsList: FC<ToolsListProps> = ({
    heading,
    current_tool,
    overrideSearch,
}) => {
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
    const sortedTools = toolsResult.data.sort(sortByVote);
    return (
        <>
            <PanelHeader level={3} text={heading}>
                {/* <Link href="/tools">{`Show all (${tools.length})`}</Link> */}
                {/* TODO: Add sorting */}
                <Dropdown />
            </PanelHeader>
            <div>
                {sortedTools
                    // Exclude current tool from list of alternatives
                    .filter((tool) => tool.name != current_tool)
                    .map((tool, index) => (
                        <ToolCard key={index} tool={tool} />
                    ))}
            </div>
            <SuggestLink />
        </>
    );
};

export default ToolsList;
