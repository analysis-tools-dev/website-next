import { FC } from 'react';
import Image from 'next/image';
import styles from './Intro.module.css';
import { Heading, Text } from '@components/typography';
import { LinkButton } from '@components/elements';
import { Wrapper } from '@components/layout';
import Link from 'next/link';

const Intro: FC = () => {
    return (
        <Wrapper className={styles.introContainer}>
            <div className={styles.textContainer}>
                <Heading level={1} className={styles.textHeading}>
                    Our Sponsors
                </Heading>
                <Text className={styles.textDescription}>
                    Thanks to our generous sponsors for supporting the project.
                    They allow us to keep the site free from ads and trackers.
                    Please check out their offers below.
                </Text>

                <LinkButton
                    label="Become a sponsor"
                    href="https://github.com/sponsors/analysis-tools-dev"
                    newTab={true}
                    className="m-r-16"
                />
            </div>

            <div className={styles.introImage}>
                <Image
                    src="/assets/images/sponsors.svg"
                    alt="Thanks to our generous sponsors for supporting the project."
                    width="800"
                    height="600"
                />
                <Link href="https://www.freepik.com/free-vector/holiday-gift-wrapping-packing-service-isometric-web-banner-landing-page_4758639.htm">
                    <a
                        className={styles.introImageRef}
                        target={'_blank'}
                        rel="noreferrer">
                        Sponsor image by vectorpuch on Freepik
                    </a>
                </Link>
            </div>
        </Wrapper>
    );
};

export default Intro;
