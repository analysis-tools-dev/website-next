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
import { sponsors } from 'utils-api/sponsors';

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
    // check if tool is a sponsor by checking if the tool name is in any of the tools fields of the sponsor object
    const isSponsor = sponsors.some((sponsor) =>
        sponsor.tools.some((toolName) => toolName === tool.id),
    );
    console.log(isSponsor);
    return (
        <Card className={styles.languageCardWrapper}>
            <div className={styles.votes}>
                <VoteWidget tool={tool} />
            </div>
            <div className={styles.info}>
                <Heading level={1} className={styles.toolHeader}>
                    {tool.name}
                </Heading>
                {isSponsor && (
                    <Image
                        className={styles.sponsorLogo}
                        height="35px"
                        width="35px"
                        src="/assets/icons/general/sponsor.svg"
                        alt="Sponsor"
                    />
                )}
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
