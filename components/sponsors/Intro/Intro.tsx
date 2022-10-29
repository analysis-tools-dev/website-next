import { FC } from 'react';
import Image from 'next/image';
import styles from './Intro.module.css';
import { Heading, Text } from '@components/typography';
import { LinkButton } from '@components/elements';
import { Wrapper } from '@components/layout';

const Intro: FC = () => {
    return (
        <Wrapper className={styles.introContainer}>
            <div className={styles.textContainer}>
                <Heading level={1} className={styles.textHeading}>
                    Our Sponsors
                </Heading>
                <Text
                    className={styles.textDescription}
                    dangerouslySetInnerHTML={{
                        __html: "Thanks to our generous sponsors for supporting the project. Without them, we wouldn't be able to keep the site running.",
                    }}></Text>

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
            </div>
        </Wrapper>
    );
};

export default Intro;
