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
            <Link href={language.href}>
                <a className={styles.languageLink}>
                    <Image
                        height="50px"
                        width="50px"
                        src={language.logo}
                        alt={language.name}
                    />
                    <Heading level={2} className={styles.languageName}>
                        {language.name} static analysis tools
                    </Heading>
                </a>
            </Link>
            <Text>
                {language.description}
                <br />
                <Link href={language.infoLink}>
                    <a className="font-light font-size-s">More info</a>
                </Link>
            </Text>

            <div className={styles.cardFooter}>
                <ShareBtns className={styles.shareBtns} />
                <Link href={language.website}>
                    <a className="font-light font-size-s m-l-4">
                        Visit website
                    </a>
                </Link>
            </div>
        </Card>
    );
};

export default LanguageCard;
