import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@components/layout';
import { Heading, Text } from '@components/typography';
import { type Language } from '@components/tools/types';

import styles from './LanguageCard.module.css';
import { ShareBtns } from '@components/core';
import { LanguageData } from 'utils/types';

export interface LanguageCardProps {
    language: LanguageData;
}
const LanguageCard: FC<LanguageCardProps> = ({ language }) => {
    return (
        <Card className={styles.languageCardWrapper}>
            <Link href={`/tag/${language.tag}`}>
                <a className={styles.languageLink}>
                    <Image
                        height="50px"
                        width="50px"
                        src={'/assets/icons/languages/multi-language.svg'}
                        alt={language.tag}
                    />
                    <Heading level={2} className={styles.languageName}>
                        {language.tag} Static Analysis Tools
                    </Heading>
                </a>
            </Link>
            {language.description && language.description !== '' && (
                <Text className={styles.description}>
                    {language.description}
                </Text>
            )}

            <div className={styles.cardFooter}>
                <ShareBtns
                    url={`https://analysis-tools.dev/tag/${language.tag}`}
                    className={styles.shareBtns}
                />
                <a
                    className="font-light font-size-s m-l-4"
                    href={language.website}
                    target="_blank"
                    rel="noopener noreferrer">
                    Visit website
                </a>
            </div>
        </Card>
    );
};

export default LanguageCard;
