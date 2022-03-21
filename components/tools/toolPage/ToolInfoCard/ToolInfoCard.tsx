import { FC } from 'react';
import Link from 'next/link';
import { Card } from '@components/layout';
import { Heading, Text } from '@components/typography';
import { type Tool } from '@components/tools';

import styles from './ToolInfoCard.module.css';
import { ShareBtns } from '@components/core';
import { TagList } from '@components/elements';
import { VoteWidget } from '@components/widgets';

export interface ToolInfoCardProps {
    tool: Tool;
}
const ToolInfoCard: FC<ToolInfoCardProps> = ({ tool }) => {
    return (
        <Card className={styles.languageCardWrapper}>
            <div className={styles.votes}>
                <VoteWidget tool={tool} />
            </div>
            <div className={styles.info}>
                <Heading level={2}>{tool.name}</Heading>
                <TagList tags={tool.other} />

                <Text>
                    {tool.description}
                    <br />
                    <Link href={tool.homepage}>
                        <a className="font-light font-size-s">More info</a>
                    </Link>
                </Text>

                <div className={styles.cardFooter}>
                    <ShareBtns className={styles.shareBtns} />
                    <Link href={tool.homepage}>
                        <a className="font-light font-size-s m-l-4">
                            Visit website
                        </a>
                    </Link>
                </div>
            </div>
        </Card>
    );
};

export default ToolInfoCard;
