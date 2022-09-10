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
import { Video } from '@splidejs/splide-extension-video';
import '@splidejs/splide-extension-video/dist/css/splide-extension-video.min.css';

import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { isSponsor } from 'utils-api/sponsors';

import Image from 'next/image';

export interface ToolInfoCardProps {
    tool: Tool;
    screenshots: { url: string; original: string }[];
}

const ToolInfoCard: FC<ToolInfoCardProps> = ({ tool, screenshots }) => {
    return (
        <Card className={styles.languageCardWrapper}>
            <div className={styles.votes}>
                <VoteWidget tool={tool} />
            </div>
            <div className={styles.info}>
                <Heading level={1} className={styles.toolHeader}>
                    {tool.name}
                </Heading>
                {isSponsor(tool.id) && (
                    <Image
                        key={`sponsor-${tool.id}`}
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
                    extensions={{ Video }}
                    options={{
                        type: 'loop',
                        rewind: true,
                        rewindByDrag: true,
                        video: {
                            mute: true,
                            playerOptions: {
                                youtube: {
                                    width: 200,
                                },
                                vimeo: {},
                                htmlVideo: {
                                    width: 200,
                                },
                            },
                        },
                    }}
                    aria-label={`${tool.name} screenshot gallery`}>
                    {screenshots &&
                        screenshots.map((screenshot) => (
                            <>
                                {(screenshot.url.includes('youtube.com') && (
                                    <SplideSlide
                                        key={screenshot.original}
                                        // add youtube link if youtube video
                                        data-splide-youtube={screenshot.url}>
                                        <Image
                                            className={styles.screenshot}
                                            width={1280}
                                            height={720}
                                            src={screenshot.original}
                                            alt={`${tool.name} screenshot`}
                                        />
                                    </SplideSlide>
                                )) || (
                                    <SplideSlide key={screenshot.original}>
                                        <Image
                                            className={styles.screenshot}
                                            width={1280}
                                            height={720}
                                            src={screenshot.original}
                                            alt={`${tool.name} screenshot`}
                                        />
                                    </SplideSlide>
                                )}
                                )
                            </>
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
