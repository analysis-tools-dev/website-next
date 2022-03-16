import { FC } from 'react';
import { PanelHeader } from '@components/elements';
import { type Tool } from '@components/tools/types';
import { ToolCard } from '@components/tools';

interface ToolsListProps {
    heading: string;
    tools: Tool[];
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

const ToolsList: FC<ToolsListProps> = ({ heading, tools }) => {
    const sortedTools = tools.sort(compare);
    return (
        <>
            <PanelHeader level={2} text={heading}>
                {/* <Link href="/tools">{`Show all (${tools.length})`}</Link> */}
                {/* TODO: Add sorting */}
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
