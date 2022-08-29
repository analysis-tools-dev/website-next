import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heading, Text } from '@components/typography';
import { votesFormatter } from 'utils/votes';
import styles from './TopToolsListWidget.module.css';
import type { Tool } from '@components/tools';
import cn from 'classnames';

export interface TopToolsWidgetProps {
    tools: Tool[];
}
const TopToolsWidget: FC<TopToolsWidgetProps> = ({ tools }) => {
    return (
        <>
            <ul className={styles.toolsList}>
                {tools
                    .sort((a, b) => b.votes - a.votes)
                    .map((tool, index) => (
                        <li key={index} className={styles.toolsListEntry}>
                            <Link href={`/tool/${tool.id}`}>
                                <a
                                    className={cn(
                                        styles.toolLinkCard,
                                        'no-underline',
                                    )}>
                                    <div className={styles.toolIcon}>
                                        <Image
                                            height="45px"
                                            width="45px"
                                            src={`/assets/icons/general/tool.svg`}
                                            alt={tool.name}
                                        />
                                    </div>
                                    <div className={styles.toolCardInfo}>
                                        <Heading level={2}>{tool.name}</Heading>
                                        <Text className={styles.toolInfo}>
                                            {tool.types[0]} - {tool.licenses[0]}{' '}
                                            - {votesFormatter(tool.votes)} votes
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
