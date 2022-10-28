import { FC } from 'react';
import Image from 'next/image';
import { Card } from '@components/layout';
import { Heading, Text } from '@components/typography';
import LinkButton from '../LinkButton/LinkButton';

import styles from './ContributionCard.module.css';

const ContributionCard: FC = () => {
    return (
        <Card>
            <Heading level={3} className="inline font-bold m-b-16">
                You Can Contribute!
            </Heading>
            <Text>
                You can help to improve this list by voting for your favorite
                tools or adding new ones{' '}
                <a
                    className={styles.githubLink}
                    href="https://github.com/analysis-tools-dev/static-analysis"
                    itemProp="url"
                    target="_blank"
                    rel="noopener noreferrer">
                    on Github{' '}
                    <Image
                        height="15px"
                        width="15px"
                        src="/assets/icons/general/github-icon.svg"
                        alt="GitHub"
                    />
                </a>
            </Text>

            <LinkButton
                href="/suggest"
                label="Suggest a tool"
                className={styles.suggestBtn}
            />
        </Card>
    );
};

export default ContributionCard;
