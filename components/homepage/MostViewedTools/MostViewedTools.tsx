import { FC } from 'react';
import Link from 'next/link';
import { PanelHeader } from '@components/elements';
import { TopToolsListWidget } from '@components/widgets';
import { type Tool } from '@components/tools';

interface MostViewedToolsProps {
    mostViewedTools: Tool[];
}

const MostViewedTools: FC<MostViewedToolsProps> = ({ mostViewedTools }) => {
    return mostViewedTools ? (
        <>
            <PanelHeader level={2} text="Most Viewed Tools">
                {/* {mostViewedTools.length > limit ? (
                    <Link href="/tools">{`Show all (${mostViewedTools.length})`}</Link>
                ) : null} */}
            </PanelHeader>

            <TopToolsListWidget tools={mostViewedTools} />
        </>
    ) : null;
};

export default MostViewedTools;
