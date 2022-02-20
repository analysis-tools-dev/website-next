import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heading, Text } from '@components/typography';
import { votesFormatter } from '@components/tools/utils';
import styles from './TopToolsListWidget.module.css';
import type { Tool } from '@components/tools/types';
import cn from 'classnames';

export interface TopToolsWidgetProps {
    tools: Tool[];
}
const TopToolsWidget: FC<TopToolsWidgetProps> = ({ tools }) => {
    return (
        <>
            <ul className={styles.toolsList}>
                {tools.map((tool, index) => (
                    <li key={index} className={styles.toolsListEntry}>
                        <Link href={tool.href}>
                            <a
                                className={cn(
                                    styles.toolLinkCard,
                                    'no-underline',
                                )}>
                                <Image
                                    height="45px"
                                    width="45px"
                                    src={tool.logo}
                                    alt={tool.name}
                                />
                                <div className={styles.toolCardInfo}>
                                    <Heading level={2}>{tool.name}</Heading>
                                    <Text className={styles.toolInfo}>
                                        {tool.type} - {tool.license} license -{' '}
                                        {votesFormatter(tool.votes)} votes
                                    </Text>
                                </div>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default TopToolsWidget;
