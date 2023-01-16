import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@components/layout';
import { Heading, Text } from '@components/typography';
import { type Language } from '@components/tools/types';

import styles from './LanguageCard.module.css';
import { ShareBtns } from '@components/core';

export interface LanguageCardProps {
    language: Language;
}
const LanguageCard: FC<LanguageCardProps> = ({ language }) => {
    return (
        <Card className={styles.languageCardWrapper}>
            <Link href={language.href} className={styles.languageLink}>
                <Image
                    height="50"
                    width="50"
                    src={language.logo}
                    alt={language.name}
                />
                <Heading level={2} className={styles.languageName}>
                    {language.name} static analysis tools
                </Heading>
            </Link>
            <Text>
                {language.description}
                <br />
                <Link
                    href={language.infoLink}
                    className="font-light font-size-s">
                    More info
                </Link>
            </Text>

            <div className={styles.cardFooter}>
                <ShareBtns url={language.href} className={styles.shareBtns} />
                <Link
                    href={language.website}
                    className="font-light font-size-s m-l-4">
                    Visit website
                </Link>
            </div>
        </Card>
    );
};

export default LanguageCard;
