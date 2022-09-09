import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import { type Tool } from '@components/tools';
import styles from './ToolInfoCard.module.css';
import { ShareBtns } from '@components/core';
import { TagList } from '@components/elements';
import { VoteWidget } from '@components/widgets';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Image from 'next/image';

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
                <div className={styles.wrapper}>
                    <ReactMarkdown className={styles.description}>
                        {tool.description || ''}
                    </ReactMarkdown>
                    <Link href={tool.homepage}>
                        <a className="font-light font-size-s">More info</a>
                    </Link>
                </div>
                <Splide
                    options={{ rewind: true }}
                    aria-label={`${tool.name} screenshot gallery`}>
                    {images.map((image) => (
                        <SplideSlide key={image.original}>
                            <Image
                                className={styles.screenshot}
                                width={1280}
                                height={720}
                                src={image.original}
                                alt={`${tool.name} screenshot`}
                            />
                        </SplideSlide>
                    ))}
                </Splide>
                <TagList languageTags={tool.languages} otherTags={tool.other} />

                <div className={styles.cardFooter}>
                    <ShareBtns
                        url={`https://analysis-tools.dev/tool/${tool.name}`}
                        className={styles.shareBtns}
                    />
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
