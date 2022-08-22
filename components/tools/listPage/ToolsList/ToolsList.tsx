import { FC } from 'react';
import {
    Dropdown,
    PanelHeader,
    LoadingCogs,
    SuggestLink,
} from '@components/elements';
import { ToolCard } from '@components/tools';
import { useToolsQuery } from '@components/tools/queries/tools';
import { SearchState, useSearchState } from 'context/SearchProvider';
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
    const { search } = useSearchState();
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

    // Exclude current tool from list of alternatives
    const sortedTools = toolsResult.data
        .filter((tool) => tool.name != current_tool)
        .sort(sortByVote);

    const singleLanguageTools = sortedTools.filter(
        (tool) => tool.languages.length === 1,
    );
    const multiLanguageTools = sortedTools.filter(
        (tool) => tool.languages.length > 1,
    );

    return (
        <>
            <PanelHeader level={3} text={heading}>
                {/* <Link href="/tools">{`Show all (${tools.length})`}</Link> */}
                {/* TODO: Add sorting */}
                <Dropdown />
            </PanelHeader>
            <div>
                {singleLanguageTools.map((tool, index) => (
                    <ToolCard key={index} tool={tool} />
                ))}
            </div>
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
