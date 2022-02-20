import { FC } from 'react';
import Link from 'next/link';
import { PanelHeader } from '@components/elements';
import { TopToolsListWidget } from '@components/tools';

import topTools from '../../../data/topTools.json';

interface MostViewedToolsProps {
    limit?: number;
}

const MostViewedTools: FC<MostViewedToolsProps> = ({ limit = 9 }) => {
    return (
        <>
            <PanelHeader level={2} text="Most Viewed Tools">
                {topTools.length > limit ? (
                    <Link href="/tools">{`Show all (${topTools.length})`}</Link>
                ) : null}
            </PanelHeader>

            <TopToolsListWidget tools={topTools.slice(0, limit)} />
        </>
    );
};

export default MostViewedTools;
