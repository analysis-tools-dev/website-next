import { FC } from 'react';
import Link from 'next/link';
import { PanelHeader, SuggestLink } from '@components/elements';
import { type Tool } from '@components/tools';
import styles from './ToolsListWidget.module.css';
import ToolsListEntry from './ToolsListEntry/ToolsListEntry';

export interface ToolsListWidgetProps {
    title: string;
    href: string;
    tools: Tool[];
    limit?: number;
}

const ToolsListWidget: FC<ToolsListWidgetProps> = ({
    title,
    href,
    tools,
    limit = 3,
}) => {
    return (
        <div className={styles.listWrapper}>
            <PanelHeader
                level={3}
                text={title}
                className={styles.listHeader}
                headingClass={styles.listHeading}>
                {tools.length > limit ? (
                    <Link href={href}>{`Show all (${tools.length})`}</Link>
                ) : null}
            </PanelHeader>
            {tools.slice(0, limit).map((tool, index) => (
                <ToolsListEntry key={index} tool={tool} />
            ))}
            {tools.length < limit ? <SuggestLink /> : null}
        </div>
    );
};

export default ToolsListWidget;
