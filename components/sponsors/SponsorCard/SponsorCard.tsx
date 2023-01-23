import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@components/layout';
import { Heading, Text } from '@components/typography';
import { SponsorData } from 'utils/types';

import styles from './SponsorCard.module.css';
import { LinkButton } from '@components/elements';

export interface SponsorCardProps {
    sponsor: SponsorData;
}

const SponsorCard: FC<SponsorCardProps> = ({ sponsor }) => {
    return (
        <Card className={styles.sponsorCardWrapper}>
            <div className={styles.logo}>
                <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
                    <Image
                        src={sponsor.logo.src}
                        alt={sponsor.name}
                        width={sponsor.logo.width}
                        height={sponsor.logo.height}
                    />
                </a>
            </div>
            <div className={styles.info}>
                <Link href={`/tools/`}>
                    <a className={styles.toolLink}>
                        <Heading level={3} className={styles.toolName}>
                            {sponsor.name}
                        </Heading>
                    </a>
                </Link>

                <Text className={styles.description}>
                    {sponsor.description || ''}
                </Text>

                <div className={styles.cardFooter}>
                    <LinkButton
                        label="Check out their tool"
                        href={`/tool/${sponsor.tool}`}
                        newTab={false}
                        variant={'small'}
                    />
                    <Link href={sponsor.href}>
                        <a
                            rel="noopener noreferrer"
                            className="font-light font-size-s m-l-4">
                            Visit website
                        </a>
                    </Link>
                </div>
            </div>
        </Card>
    );
};

export default SponsorCard;
