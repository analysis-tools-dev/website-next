import { FC } from 'react';
import Image from 'next/image';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import styles from './ResourcesCard.module.css';

export interface Resource {
    title: string;
    url: string;
}

export interface ResourcesCardProps {
    resources: Resource[] | null;
}

const ResourcesCard: FC<ResourcesCardProps> = ({ resources }) => {
    return (
        <Card>
            <Heading level={3} className="m-b-16 font-bold">
                More Resources
            </Heading>

            {resources && (
                <ul className={styles.resourceList}>
                    {resources.map((resource, index) => (
                        <li key={`resource-${index}`}>
                            <a
                                className={styles.link}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer">
                                <span className={styles.icon}>
                                    <Image
                                        height="15"
                                        width="15"
                                        src="/assets/icons/general/link-alt.svg"
                                        alt={resource.title}
                                    />
                                </span>
                                <span className={styles.title}>
                                    {resource.title}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
            {!resources && <span>Suggest resources</span>}
        </Card>
    );
};

export default ResourcesCard;
