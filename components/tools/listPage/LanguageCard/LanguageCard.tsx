import { FC } from 'react';
import Link from 'next/link';
import { Card } from '@components/layout';
import { Heading, Text } from '@components/typography';

import styles from './LanguageCard.module.css';
import { ShareBtns } from '@components/core';
import { LanguageData } from 'utils/types';
import { ImageWithFallback } from '@components/elements/ImageWithFallback';
import { Tool } from '@components/tools/types';

export interface LanguageCardProps {
    tools: Tool[];
    tag: string;
    tagData: LanguageData;
}
const LanguageCard: FC<LanguageCardProps> = ({ tools, tag, tagData }) => {
    const tagName = tagData.name;
    // use the tag name if it's available, otherwise use the tag itself (capitalized)
    const languageName = tagName
        ? tagName
        : tag.charAt(0).toUpperCase() + tag.slice(1);

    return (
        <Card key={tagName} className={styles.languageCardWrapper}>
            <div className={styles.languageCardHeader}>
                <ImageWithFallback
                    height="50px"
                    width="50px"
                    src={`/assets/icons/languages/${tag}.svg`}
                    fallbackSrc="/assets/icons/languages/multi-language.svg"
                    alt={tagData.name}
                />
                <Heading level={2} className={styles.languageName}>
                    {languageName} Static Analysis Tools
                </Heading>
            </div>
            <Text className={styles.description}>
                <p>
                    We rank{' '}
                    <strong>
                        {tools.length} {languageName} linters, code analyzers,
                        formatters
                    </strong>
                    , and more. Find and compare tools like{' '}
                    {tools
                        .slice(0, 3)
                        .map((tool) => tool.name)
                        .join(', ')}
                    , and more. Please rate and review tools that you&apos;ve
                    used. This helps others find the best tools for their
                    projects.
                </p>
            </Text>

            <div className={styles.cardFooter}>
                <ShareBtns
                    url={`https://analysis-tools.dev/tag/${tag}`}
                    className={styles.shareBtns}
                />
                {tagData.website && (
                    <a
                        className="font-light font-size-s m-l-4"
                        href={tagData.website}
                        target="_blank"
                        rel="noopener noreferrer">
                        Learn more about {languageName}
                    </a>
                )}
            </div>
        </Card>
    );
};

export default LanguageCard;
