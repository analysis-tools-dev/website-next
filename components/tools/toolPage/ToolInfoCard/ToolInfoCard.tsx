import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@components/layout';
import { Heading, Text } from '@components/typography';
import { type Tool } from '@components/tools';

import styles from './ToolInfoCard.module.css';
import { ShareBtns } from '@components/core';
import { TagList } from '@components/elements';

export interface ToolInfoCardProps {
    tool: Tool;
}
const ToolInfoCard: FC<ToolInfoCardProps> = ({ tool }) => {
    return (
        <Card className={styles.languageCardWrapper}>
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
        </Card>
    );
};

export default ToolInfoCard;
