import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import { type Affiliate } from '@components/affiliates/types';

import styles from './AffiliateCard.module.css';

export interface AffiliateCardProps {
    affiliate: Affiliate;
}

const AffiliateCard: FC<AffiliateCardProps> = ({ affiliate }) => {
    return (
        <Card className={styles.affiliateCardWrapper}>
            <div className={styles.info}>
                <Link href={affiliate.url}>
                    <a className={styles.affiliateLink}>
                        <Heading level={3} className={styles.affiliateName}>
                            {affiliate.name}
                        </Heading>
                    </a>
                </Link>

                <ReactMarkdown className={styles.description}>
                    {affiliate.description || ''}
                </ReactMarkdown>
            </div>
        </Card>
    );
};

export default AffiliateCard;
