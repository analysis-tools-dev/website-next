import { FC } from 'react';
import { LoadingCogs, PanelHeader } from '@components/elements';
import { TopToolsListWidget } from '@components/widgets';
import { useMostViewedQuery } from '../queries/mostViewed';

const MostViewedTools: FC = () => {
    const mostViewedResults = useMostViewedQuery();

    if (
        mostViewedResults.isLoading ||
        mostViewedResults.isFetching ||
        mostViewedResults.isRefetching
    ) {
        return <LoadingCogs />;
    }
    if (mostViewedResults.error || !mostViewedResults.data) {
        return null;
    }

    return (
        <>
            <PanelHeader level={2} text="Most Viewed Tools">
                {/* {mostViewedTools.length > limit ? (
                    <Link href="/tools">{`Show all (${mostViewedTools.length})`}</Link>
                ) : null} */}
            </PanelHeader>

            <TopToolsListWidget tools={mostViewedResults.data} />
        </>
    );
};

export default MostViewedTools;
