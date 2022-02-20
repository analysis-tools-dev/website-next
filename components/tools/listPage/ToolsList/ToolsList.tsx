import { FC } from 'react';
import Link from 'next/link';
import { PanelHeader } from '@components/elements';
import { type Tool } from '@components/tools/types';

interface ToolsListProps {
    language: string;
    tools: Tool[];
}

const ToolsList: FC<ToolsListProps> = ({ language, tools }) => {
    return (
        <>
            <PanelHeader
                level={2}
                text={`${tools.length} ${language} static analysis tools`}>
                {/* <Link href="/tools">{`Show all (${tools.length})`}</Link> */}
            </PanelHeader>
        </>
    );
};

export default ToolsList;
