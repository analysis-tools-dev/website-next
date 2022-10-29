import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heading, Text } from '@components/typography';
import { Card } from '@components/layout';
import styles from './SponsorCard.module.css';
import { sponsors } from 'utils-api/sponsors';

const SponsorCard: FC = () => {
    return (
        <Card>
            <Heading level={3} className="inline font-bold m-b-16">
                Our Sponsors
            </Heading>
            <Text>
                This website is completely open source. To fund our work, we
                fully rely on sponsors. Thanks to them, we can keep the site
                free for everybody. Please check out their offers below.
            </Text>

            <ul className={styles.sponsorList}>
                {sponsors.map((sponsor, index) => (
                    <li key={index} className={styles.listItem}>
                        {sponsor.external ? (
                            <a
                                className={`font-color-light ${styles.sponsorLink}`}
                                href={sponsor.href}
                                target={'_blank'}
                                rel="noreferrer">
                                <Image
                                    src={sponsor.logo}
                                    width={sponsor.width}
                                    height={sponsor.height}
                                    alt={sponsor.name}
                                />
                            </a>
                        ) : (
                            <Link href={sponsor.href}>
                                <a
                                    className={`font-color-light ${styles.sponsorLink}`}>
                                    <Image
                                        src={sponsor.logo}
                                        width={sponsor.width}
                                        height={sponsor.height}
                                        alt={sponsor.name}
                                    />
                                </a>
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default SponsorCard;
