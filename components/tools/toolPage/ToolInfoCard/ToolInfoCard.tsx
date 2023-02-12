import { FC } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import { ShareBtns } from '@components/core';
import { TagList } from '@components/elements';
import { VoteWidget } from '@components/widgets';
import { isSponsor } from 'utils/sponsor';

import styles from './ToolInfoCard.module.css';

import { type Tool } from '@components/tools';

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
