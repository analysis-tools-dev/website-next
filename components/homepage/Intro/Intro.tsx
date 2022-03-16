import { FC } from 'react';
import Image from 'next/image';
import styles from './Intro.module.css';
import { Heading, Text } from '@components/typography';
import { LinkButton } from '@components/elements';
import { Wrapper } from '@components/layout';

// TODO: Add validation and fallback
import homepageIntro from '../../../data/homepageIntro.json';

const Intro: FC = () => {
    return (
        <Wrapper className={styles.introContainer}>
            <div className={styles.textContainer}>
                <Heading level={1} className={styles.textHeading}>
                    {homepageIntro.heading}
                </Heading>
                <Text className={styles.textDescription}>
                    {homepageIntro.description}
                </Text>

                <LinkButton
                    label="Find the right tool"
                    href="/tools"
                    className="m-r-16"
                />
                <LinkButton
                    label="Source Code"
                    href={homepageIntro.githubLink}
                    type="github"
                    newTab
                />
            </div>

            <Image
                src={homepageIntro.image.src}
                alt={homepageIntro.image.alt}
                width={homepageIntro.image.width}
                height={homepageIntro.image.height}
            />
        </Wrapper>
    );
};

export default Intro;
