import { FC } from 'react';
import Link from 'next/link';
import { Button, PanelHeader } from '@components/elements';
import { Tool } from '../../types';
import styles from './ToolsListWidget.module.css';
import ToolsListEntry from '../ToolsListEntry/ToolsListEntry';

export interface ToolsListWidgetProps {
    title: string;
    href: string;
    tools: Tool[];
}

const ToolsListWidget: FC<ToolsListWidgetProps> = ({ title, href, tools }) => {
    return (
        <div className={styles.listWrapper}>
            <PanelHeader
                level={3}
                text={title}
                className={styles.listHeader}
                headingClass={styles.listHeading}>
                {tools.length > 3 ? (
                    <Link href={href}>{`Show all (${tools.length})`}</Link>
                ) : null}
            </PanelHeader>
            {tools.slice(0, 3).map((tool, index) => (
                <ToolsListEntry key={index} tool={tool} />
            ))}
            {tools.length < 3 ? (
                <Button className={styles.suggestBtn}>Suggest Tool</Button>
            ) : null}
        </div>
    );
};

export default ToolsListWidget;
