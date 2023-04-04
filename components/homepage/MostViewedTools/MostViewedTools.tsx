import { FC } from 'react';
import { PanelHeader } from '@components/elements';
import { TopToolsListWidget } from '@components/widgets';
import { Tool } from '@components/tools';

interface MostViewedToolsProps {
    tools: Tool[];
}

const MostViewedTools: FC<MostViewedToolsProps> = ({ tools }) => {
    return (
        <div className="m-t-40">
            <PanelHeader level={2} text="Most Viewed Tools"></PanelHeader>

            <TopToolsListWidget tools={tools} />
        </div>
    );
};

export default MostViewedTools;
