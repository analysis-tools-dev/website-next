import Link from 'next/link';
import Image from 'next/image';
import { FC } from 'react';

import styles from './SponsorCard.module.css';
import { Heading, Text } from '@components/typography';
import { LinkButton } from '@components/elements';

const SponsorCard: FC = () => {
    const sponsors = [
        {
            name: 'DeepCode',
            href: '/sponsor/deep-code',
            logo: '/assets/images/sponsors/deepcode.png',
            width: '200px',
            height: '54px',
            external: false,
        },
        {
            name: 'CodeScene',
            href: '/sponsor/code-scene',
            logo: '/assets/images/sponsors/codescene.svg',
            width: '200px',
            height: '50px',
            external: false,
        },
        {
            name: 'R2C',
            href: '/sponsor/r2c',
            logo: '/assets/images/sponsors/r2c.svg',
            width: '80px',
            height: '80px',
            external: false,
        },
        {
            name: 'Codiga',
            href: '/sponsor/codiga',
            logo: '/assets/images/sponsors/codiga.svg',
            width: '72px',
            height: '65px',
            external: false,
        },
    ];

    return (
        <div className={styles.sponsorWrapper}>
            <Heading level={2} className="font-bold centered m-b-30">
                Our Sponsors
            </Heading>
            <Text className="font-size-s centered m-b-30">
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

            <LinkButton
                href="https://github.com"
                label="Become a sponsor"
                className="m-t-30"
                newTab
            />
        </div>
    );
};

export default SponsorCard;
