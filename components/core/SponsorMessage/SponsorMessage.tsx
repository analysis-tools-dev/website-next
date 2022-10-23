import { FC } from 'react';
import { Heading, Text } from '@components/typography';
import { LinkButton } from '@components/elements';
import { Wrapper } from '@components/layout';
import styles from './SponsorMessage.module.css';

const SponsorMessage: FC = () => {
    return (
        <div className={styles.sponsorContainer}>
            <Wrapper className={styles.wrapper}>
                <Heading level={2} className="font-bold centered m-b-30">
                    ❤️ Reach Thousands Of Devs Interested In Code Quality
                </Heading>
                <Text className="font-size-s centered m-b-30">
                    That&apos;s why we are currently looking for partners who
                    want to sponsor hosting and development of the project.
                    <br />
                    <br />
                    We believe that this project should be entirely open to
                    avoid bias and gatekeepers, which promote tools purely based
                    on monetary interest and not on quality. Since we want this
                    to be a community project and the code/assets to be freely
                    available to everyone, we&apos;ll use Github Sponsors + Open
                    Collective for funding.
                    <br />
                    <br />
                    If you believe in the same values, don&apos;t hestitate to
                    reach out via mail at hello@analysis-tools.dev
                </Text>

                <LinkButton
                    href="https://github.com"
                    label="Become a sponsor"
                    className="m-t-30"
                    newTab
                />
            </Wrapper>
        </div>
    );
};

export default SponsorMessage;
