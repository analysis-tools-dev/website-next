import { FC } from 'react';
import { withRouter, type Router } from 'next/router';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import styles from './LanguageFilterCard.module.css';
import classNames from 'classnames';
import { tagIconPath } from 'utils/icons';
import Image from 'next/image';
import Link from 'next/link';

export interface LanguageFilterOption {
    value: string;
    name: string;
    tag_type?: string;
    results?: number;
}

export interface RelatedCardProps {
    options: LanguageFilterOption[];
    router: Router;
    className?: string;
}

const RelatedCard: FC<RelatedCardProps> = ({
    options: relatedLanguages,
    className,
}) => {
    return (
        <Card className={classNames(className)}>
            <Heading level={3} className="m-b-16 font-bold">
                Related Searches
            </Heading>

            <ul className={styles.relatedList}>
                {relatedLanguages.map((option, index) => (
                    <li key={index}>
                        <a
                            href={`/tag/${option.value}`}
                            className={styles.relatedLink}>
                            <Image
                                src={tagIconPath(option.value)}
                                alt={option.name}
                                width={20}
                                height={20}
                            />
                            <div>{option.name}</div>
                        </a>
                    </li>
                ))}
                <li key={'all'}>
                    <Link href={`/tools`} className={styles.relatedLink}>
                        <Image
                            src={`/assets/icons/general/back.svg`}
                            alt={'Other Languages'}
                            width={20}
                            height={20}
                        />
                        <div>Other Languages</div>
                    </Link>
                </li>
            </ul>
        </Card>
    );
};

export default withRouter(RelatedCard);
