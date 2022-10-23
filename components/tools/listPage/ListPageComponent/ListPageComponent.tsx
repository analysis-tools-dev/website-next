import { LoadingCogs } from '@components/elements';
import { Panel } from '@components/layout';
import { ToolsList, ToolsSidebar } from '@components/tools';
import { useToolsQuery } from '@components/tools/queries';
import { useSearchState } from 'context/SearchProvider';
import { FC } from 'react';
import { Article } from 'utils/types';

export interface ListComponentProps {
    articles: Article[];
}
const ListComponent: FC<ListComponentProps> = ({ articles }) => {
    const { search } = useSearchState();
    const queryResult = useToolsQuery(search);

    if (
        queryResult.isLoading ||
        queryResult.isFetching ||
        queryResult.isRefetching
    ) {
        return (
            <>
                <ToolsSidebar articles={articles} />
                <Panel>
                    <LoadingCogs />
                </Panel>
            </>
        );
    }
    if (queryResult.error || !queryResult.data) {
        return null;
    }
    const toolData = queryResult.data || [];

    return (
        <>
            <ToolsSidebar articles={articles} />
            <Panel>
                <ToolsList tools={toolData} />
            </Panel>
        </>
    );
};

export default ListComponent;
