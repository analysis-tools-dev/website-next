import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Intro.module.css';
import { Heading, Text } from '@components/typography';
import { LinkButton } from '@components/elements';
import { Wrapper } from '@components/layout';

import homepageData from '@appdata/homepage.json';

const typoLookup: Record<string, string> = {
    Because: 'Becuase',
    Quality: 'Qualty',
    Code: 'Cdoe',
    Matters: 'Maters',
};

const getRandomWordWithTypo = (text: string) => {
    const words = text.split(' ');
    const typoCandidates = words.filter((word) => typoLookup[word]);
    const randomIndex = Math.floor(Math.random() * typoCandidates.length);
    const typoWord = typoCandidates[randomIndex];

    if (typoWord) {
        return { original: typoWord, typo: typoLookup[typoWord] };
    }
    return null;
};

const Intro: FC = () => {
    const homepageIntro = homepageData.intro;
    const originalHeadline = 'Because Code Quality Matters';
    const [headline, setHeadline] = useState(originalHeadline);
    const [typoWord, setTypoWord] = useState<{
        original: string;
        typo: string;
    } | null>(null);

    const introduceTypo = () => {
        const typo = getRandomWordWithTypo(originalHeadline);
        if (typo) {
            const newHeadline = originalHeadline.replace(
                typo.original,
                `<span class="${styles.squiggly} ${styles.typo}">${typo.typo}</span>`,
            );
            setHeadline(newHeadline);
            setTypoWord(typo);
        }
    };

    useEffect(() => {
        introduceTypo();
        const interval = setInterval(() => {
            introduceTypo();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const handleClick = () => {
        if (typoWord) {
            setHeadline(originalHeadline);
            setTypoWord(null);
        }
    };

    return (
        <Wrapper className={styles.introContainer}>
            <div className={styles.textContainer}>
                <Heading level={1} className={styles.textHeading}>
                    <span
                        dangerouslySetInnerHTML={{ __html: headline }}
                        onClick={handleClick}></span>
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
