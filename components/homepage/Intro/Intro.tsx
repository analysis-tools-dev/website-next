import { FC } from 'react';
import Image from 'next/image';
import styles from './Intro.module.css';
import { Heading, Text } from '@components/typography';
import { LinkButton } from '@components/elements';

const Intro: FC = () => {
    const heading = 'Write Better Software';
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';
    const image = '/assets/images/intro-image.png';

    return (
        <div className={styles.introContainer}>
            <div className={styles.textContainer}>
                <Heading level={1} className={styles.textHeading}>
                    {heading}
                </Heading>
                <Text className={styles.textDescription}>{description}</Text>

                <LinkButton
                    label="Find the right tool"
                    href="/tools"
                    className="m-r-16"
                />
                <LinkButton
                    label="Source Code"
                    href="https://github.com"
                    type="github"
                    newTab
                />
            </div>

            <Image src={image} alt="" width="658px" height="285px" />
        </div>
    );
};

export default Intro;
