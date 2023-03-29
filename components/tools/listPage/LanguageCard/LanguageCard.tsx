import { FC } from 'react';
import Link from 'next/link';
import { Card } from '@components/layout';
import { Heading, Text } from '@components/typography';

import styles from './LanguageCard.module.css';
import { ShareBtns } from '@components/core';
import { LanguageData } from 'utils/types';
import { ImageWithFallback } from '@components/elements/ImageWithFallback';

export interface LanguageCardProps {
    tag: string;
    tagData: LanguageData;
}
const LanguageCard: FC<LanguageCardProps> = ({ tag, tagData }) => {
    const tagName = tagData.name;
    // use the tag name if it's available, otherwise use the tag itself (capitalized)
    const languageName = tagName
        ? tagName
        : tag.charAt(0).toUpperCase() + tag.slice(1);

    return (
        <Card key={tagName} className={styles.languageCardWrapper}>
            <Link href={`/tag/${tag}`}>
                <a className={styles.languageLink}>
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
                </a>
            </Link>
            {tagData.description && tagData.description !== '' && (
                <Text className={styles.description}>
                    {tagData.description}
                </Text>
            )}

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
                        Visit website
                    </a>
                )}
            </div>
        </Card>
    );
};

export default LanguageCard;
