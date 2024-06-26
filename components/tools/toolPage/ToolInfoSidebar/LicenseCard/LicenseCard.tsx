import { FC } from 'react';
import Image from 'next/image';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import styles from './LicenseCard.module.css';

export interface LicenseCardProps {
    name: string;
    licenses: string[];
    pricing?: string | null;
}

const LicenseCard: FC<LicenseCardProps> = ({ name, licenses, pricing }) => {
    const license = licenses[0];

    return (
        <Card>
            <Heading level={3} className="m-b-16 font-bold">
                License Type
            </Heading>

            <div>
                <div className={styles.icon}>
                    <Image
                        height="15"
                        width="15"
                        src="/assets/icons/general/copyright.svg"
                        alt={license}
                    />
                </div>
                <span className={styles.licenseText}>{license}</span>
                {pricing && (
                    <>
                        <a
                            className={styles.licenseUrl}
                            href={pricing}
                            target="_blank"
                            rel="noopener noreferrer">
                            <span className={styles.urlIcon}>
                                <Image
                                    height="12"
                                    width="12"
                                    src="/assets/icons/general/link-alt.svg"
                                    alt={license}
                                />
                            </span>
                            <span
                                className={
                                    styles.urlText
                                }>{`${name} pricing plans`}</span>
                        </a>
                    </>
                )}
            </div>
        </Card>
    );
};

export default LicenseCard;
