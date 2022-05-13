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
    overrideSearch?: SearchState; //FIXME: Change to be filters: Language, ToolID,etc..
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
    const sortedTools = toolsResult.data.sort(sortByVote);
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
            <SuggestLink />
        </>
    );
};

export default ToolsList;
