import { FC } from 'react';
import Image from 'next/image';
import styles from './Intro.module.css';
import { Heading, Text } from '@components/typography';
import { LinkButton } from '@components/elements';
import { Wrapper } from '@components/layout';

import homepageData from '@appdata/homepage.json';

const Intro: FC = () => {
    const homepageIntro = homepageData.intro;
    return (
        <Wrapper className={styles.introContainer}>
            <div className={styles.textContainer}>
                <Heading level={1} className={styles.textHeading}>
                    {homepageIntro.heading}
                </Heading>
                <Text
                    className={styles.textDescription}
                    dangerouslySetInnerHTML={{
                        __html: homepageIntro.description,
                    }}></Text>

                <div className={styles.actionBtns}>
                    <LinkButton
                        label="Show Tools"
                        variant="big"
                        href="/tools"
                        className="m-r-16"
                    />
                    <LinkButton
                        label="Source Code"
                        variant="big"
                        href={homepageIntro.githubLink}
                        type="github"
                        newTab
                    />
                </div>
            </div>

            <div className={styles.introImage}>
                <Image
                    src={homepageIntro.image.src}
                    alt={homepageIntro.image.alt}
                    width={homepageIntro.image.width}
                    height={homepageIntro.image.height}
                />
                <a
                    className={styles.introImageRef}
                    href="https://www.freepik.com/free-vector/software-testing-isometric-banner-functional-test_9292792.htm"
                    target="_blank"
                    rel="noopener noreferrer">
                    Hero image by upklyak on Freepik
                </a>
            </div>
        </Wrapper>
    );
};

export default Intro;
