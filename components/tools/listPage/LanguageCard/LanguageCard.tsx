import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@components/layout';
import { Heading, Text } from '@components/typography';

import styles from './LanguageCard.module.css';
import { ShareBtns } from '@components/core';
import { LanguageData } from 'utils/types';

export interface LanguageCardProps {
    tag: string;
    tagData: LanguageData;
}
const LanguageCard: FC<LanguageCardProps> = ({ tag, tagData }) => {
    return (
        <Card className={styles.languageCardWrapper}>
            <Link href={`/tag/${tag}`}>
                <a className={styles.languageLink}>
                    <Image
                        height="50px"
                        width="50px"
                        src={'/assets/icons/languages/multi-language.svg'}
                        alt={tagData.name}
                    />
                    <Heading level={2} className={styles.languageName}>
                        {tagData.name} Static Analysis Tools
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
                <a
                    className="font-light font-size-s m-l-4"
                    href={tagData.website}
                    target="_blank"
                    rel="noopener noreferrer">
                    Visit website
                </a>
            </div>
        </Card>
    );
};

export default LanguageCard;
