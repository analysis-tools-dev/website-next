import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heading, Text } from '@components/typography';
import { LinkButton } from '@components/elements';
import { Wrapper } from '@components/layout';
import styles from './SponsorBanner.module.css';
import { sponsors } from 'utils-api/sponsors';

const SponsorBanner: FC = () => {
    return (
        <div className={styles.sponsorContainer}>
            <Wrapper className={styles.wrapper}>
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
                                    target="_blank"
                                    rel="noopener noreferrer">
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
                    href="https://github.com/sponsors/analysis-tools-dev"
                    label="Become a sponsor"
                    className="m-t-30"
                    newTab
                />
            </Wrapper>
        </div>
    );
};

export default SponsorBanner;
