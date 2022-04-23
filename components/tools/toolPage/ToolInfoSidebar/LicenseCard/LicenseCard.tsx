import { FC } from 'react';
import Image from 'next/image';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import styles from './LicenseCard.module.css';

export interface LicenseCardProps {
    name: string;
    licenses: string[];
}

const LicenseCard: FC<LicenseCardProps> = ({ name, licenses }) => {
    const license = licenses[0];

    return (
        <Card className="m-b-30">
            <Heading level={3} className="m-b-16 font-bold">
                License Type
            </Heading>

            <div>
                <div className={styles.icon}>
                    <Image
                        height="15x"
                        width="15px"
                        src="/assets/icons/general/copyright.svg"
                        alt={license}
                    />
                </div>
                <span className={styles.licenseText}>{license}</span>
                <a
                    className={styles.licenseUrl}
                    href={'https://github.com'}
                    target={'_blank'}
                    rel="noreferrer">
                    <span className={styles.urlIcon}>
                        <Image
                            height="12x"
                            width="12px"
                            src="/assets/icons/general/link-alt.svg"
                            alt={license}
                        />
                    </span>
                    <span
                        className={
                            styles.urlText
                        }>{`${name} license file`}</span>
                </a>
            </div>
            <a
                className={styles.learnMore}
                href={'https://github.com'}
                target={'_blank'}
                rel="noreferrer">
                Learn more about repository licenses
            </a>
        </Card>
    );
};

export default LicenseCard;