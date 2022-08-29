import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Card } from '@components/layout';
import { Heading, Text } from '@components/typography';
import { type Tool } from '@components/tools';

import styles from './ToolInfoCard.module.css';
import { ShareBtns } from '@components/core';
import { TagList } from '@components/elements';
import { VoteWidget } from '@components/widgets';

import ImageGallery from 'react-image-gallery';

import 'react-image-gallery/styles/css/image-gallery.css';

export interface ToolInfoCardProps {
    tool: Tool;
    screenshots: string[];
}
const ToolInfoCard: FC<ToolInfoCardProps> = ({ tool, screenshots }) => {
    const images = screenshots.map((screenshot) => ({
        original: screenshot,
        thumbnail: screenshot,
    }));
    return (
        <Card className={styles.languageCardWrapper}>
            <div className={styles.votes}>
                <VoteWidget tool={tool} />
            </div>
            <div className={styles.info}>
                <Heading level={1}>{tool.name}</Heading>
                <TagList tags={tool.languages} />
                <TagList tags={tool.other} />

                <Text className={styles.description}>
                    <ReactMarkdown>{tool.description || ''}</ReactMarkdown>
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
                <ImageGallery items={images} />
            </div>
        </Card>
    );
};

export default ToolInfoCard;
