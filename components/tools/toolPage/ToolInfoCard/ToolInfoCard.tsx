import { FC } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Giscus from '@giscus/react';
import classNames from 'classnames';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import { ShareBtns } from '@components/core';
import { TagList } from '@components/elements';
import { VoteWidget } from '@components/widgets';
import { isSponsor } from 'utils/sponsor';
import { type Tool } from '@components/tools';

import styles from './ToolInfoCard.module.css';

export interface ToolInfoCardProps {
    tool: Tool;
}

const ToolInfoCard: FC<ToolInfoCardProps> = ({ tool }) => {
    return (
        <Card className={styles.languageCardWrapper}>
            <div className={styles.votes}>
                <VoteWidget toolId={tool.id} />
            </div>
            <div className={styles.info}>
                <div className={styles.toolLogo}>
                    <Image
                        width={35}
                        height={35}
                        src={
                            tool.icon
                                ? tool.icon
                                : `/assets/icons/general/tool.svg`
                        }
                        alt={`${tool.name} logo`}
                    />
                </div>

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
                    <a
                        className={classNames(
                            styles['moreInfo'],
                            'font-light font-size-s',
                        )}
                        href={tool.homepage}
                        target="_blank"
                        rel="noopener noreferrer">
                        More info
                    </a>
                </div>
                <TagList languageTags={tool.languages} otherTags={tool.other} />
                <div className={styles.cardFooter}>
                    <ShareBtns
                        url={`https://analysis-tools.dev/tool/${tool.name}`}
                        className={styles.shareBtns}
                    />
                    <a
                        href={tool.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-light font-size-s m-l-4">
                        Visit website
                    </a>
                </div>

                {/* TODO: Switch to theme="https://analysis-tools.dev/assets/styles/giscus.css" once it's deployed */}
                <Giscus
                    id="comments"
                    repo="analysis-tools-dev/website-comments"
                    repoId="MDEwOlJlcG9zaXRvcnkyNzI2MjQzNjI="
                    category="General"
                    categoryId="MDE4OkRpc2N1c3Npb25DYXRlZ29yeTg2MzkzMTg="
                    mapping="pathname"
                    term="Welcome to @giscus/react component!"
                    reactionsEnabled="1"
                    emitMetadata="0"
                    inputPosition="bottom"
                    theme="https://giscus.app/themes/custom_example.css"
                    lang="en"
                    loading="lazy"
                />
            </div>
        </Card>
    );
};

export default ToolInfoCard;
