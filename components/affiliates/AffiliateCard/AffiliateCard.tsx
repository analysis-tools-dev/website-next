import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import { type Affiliate } from '@components/affiliates/types';

import styles from './AffiliateCard.module.css';
import { Button } from '@components/elements';

export interface AffiliateCardProps {
    affiliate: Affiliate;
}

const AffiliateCard: FC<AffiliateCardProps> = ({ affiliate }) => {
    return (
        <Card className={styles.affiliateCardWrapper}>
            <div className={styles.info}>
                <div className={styles.logo}>
                    <Image
                        width="50px"
                        height="50px"
                        src={affiliate.logo}
                        alt={affiliate.headline}
                    />
                </div>
                <div>
                    <Link href={affiliate.href}>
                        <a
                            className={styles.affiliateLink}
                            href={affiliate.href}
                            target="_blank"
                            rel="noreferrer">
                            <Heading level={3} className={styles.affiliateName}>
                                {affiliate.headline}
                            </Heading>
                        </a>
                    </Link>

                    <ReactMarkdown className={styles.description}>
                        {affiliate.description || ''}
                    </ReactMarkdown>

                    <div className={styles.cta}>
                        <Link href={affiliate.href} target="_blank">
                            <a className={styles.affiliateLink}>
                                <Button
                                    className={styles.button}
                                    theme="primary">
                                    {affiliate.callToAction}
                                </Button>
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default AffiliateCard;
