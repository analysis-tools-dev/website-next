import { FC } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
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
    const toolStatus = tool.deprecated ? 'Deprecated' : 'Maintained';

    return (
        <Card className={styles.languageCardWrapper}>
            <div className={styles.votes}>
                <VoteWidget
                    toolId={tool.id}
                    upvotePercentage={tool.upvotePercentage}
                />
            </div>
            <div className={styles.info}>
                <a
                    href={tool.homepage}
                    className={styles.toolLink}
                    target="_blank"
                    rel="noopener noreferrer">
                    <div className={styles.toolLogo}>
                        <Image
                            width={50}
                            height={50}
                            src={
                                tool.icon
                                    ? tool.icon
                                    : `/assets/icons/general/tool.svg`
                            }
                            alt={`${tool.name} logo`}
                        />
                    </div>

                    <div>
                        <div className={styles.toolName}>
                            <Heading level={1} className={styles.toolHeader}>
                                {tool.name}
                            </Heading>
                            {isSponsor(tool.id) && (
                                <Image
                                    key={`sponsor-${tool.id}`}
                                    className={styles.sponsorLogo}
                                    height="20"
                                    width="20"
                                    src="/assets/icons/general/sponsor.svg"
                                    alt="Sponsor"
                                />
                            )}
                        </div>
                        <div className={styles.maintained}>
                            <Image
                                key={`status-${tool.id}`}
                                height="12"
                                width="12"
                                src={`/assets/icons/general/${toolStatus.toLowerCase()}.svg`}
                                alt={toolStatus}
                            />
                            <span>{toolStatus}</span>
                        </div>
                    </div>
                </a>
                <div className={styles.wrapper}>
                    <ReactMarkdown className={styles.description}>
                        {tool.description || ''}
                    </ReactMarkdown>
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
            </div>
        </Card>
    );
};

export default ToolInfoCard;
