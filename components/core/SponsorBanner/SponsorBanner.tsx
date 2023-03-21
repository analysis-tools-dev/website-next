import { FC } from 'react';
import Image from 'next/image';
import { Heading, Text } from '@components/typography';
import { LinkButton } from '@components/elements';
import { Wrapper } from '@components/layout';
import styles from './SponsorBanner.module.css';
import { SponsorData } from 'utils/types';

export interface SponsorBannerProps {
    sponsors: SponsorData[];
}

const SponsorBanner: FC<SponsorBannerProps> = ({ sponsors }) => {
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
                            <a
                                className={`font-color-light ${styles.sponsorLink}`}
                                href={sponsor.href}
                                target="_blank"
                                rel="noopener noreferrer">
                                <Image
                                    src={sponsor.logo.src}
                                    width={sponsor.logo.width}
                                    height={sponsor.logo.height}
                                    alt={sponsor.name}
                                />
                            </a>
                        </li>
                    ))}
                </ul>

                <LinkButton
                    href="https://github.com/sponsors/analysis-tools-dev"
                    label="Become a Sponsor"
                    className="m-t-30"
                    newTab
                />
            </Wrapper>
        </div>
    );
};

export default SponsorBanner;
