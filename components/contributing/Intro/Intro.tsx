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
                    Contributing
                </Heading>
                <Text className={styles.textDescription}>
                    Analysis Tools is a community project. You can help to
                    improve this website by voting for your favorite tools or
                    suggesting missing ones. Your help is very much appreciated!
                </Text>

                <LinkButton
                    label="Contribute on Github"
                    href="https://github.com/analysis-tools-dev/static-analysis/blob/master/CONTRIBUTING.md"
                    newTab={true}
                    className="m-r-16"
                />
            </div>

            <div className={styles.introImage}>
                <Image
                    src="/assets/images/contributing.svg"
                    alt="Thanks to to all contributors of the project."
                    width="800"
                    height="600"
                />
                <Link
                    href="https://www.freepik.com/free-vector/hackathon-isometric-landing-software-development_9292828.htm"
                    className={styles.introImageRef}
                    target={'_blank'}
                    rel="noopener noreferrer">
                    Image by upklyak on Freepik
                </Link>
            </div>
        </Wrapper>
    );
};

export default Intro;
