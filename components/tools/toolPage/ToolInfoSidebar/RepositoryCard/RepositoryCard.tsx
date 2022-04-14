import { FC } from 'react';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import InfoEntry from '../InfoEntry/InfoEntry';
import { type RepositoryData } from '@components/tools';
import { dateDiffFromNow } from 'utils/date';
import styles from './RepositoryCard.module.css';

export interface RepositoryCardProps {
    data: RepositoryData;
}

const RepositoryCard: FC<RepositoryCardProps> = ({ data }) => {
    const icon = '/assets/icons/general/github-icon.svg';

    return (
        <Card className="m-b-30">
            <Heading level={3} className="m-b-16 font-bold">
                Repository
            </Heading>

            <InfoEntry
                label={'Source'}
                id="source"
                value={data.source}
                icon={icon}
            />

            <InfoEntry label={'Stars'} id="stars" value={data.stars} />
            <div className={styles.splitWrapper}>
                <InfoEntry
                    label={'Issues'}
                    id="issues"
                    value={data.issues}
                    className={styles.splitEntry}
                />
                <InfoEntry
                    label={'Forks'}
                    id="forks"
                    value={data.forks}
                    className={styles.splitEntry}
                />
            </div>
            <div className={styles.splitWrapper}>
                <InfoEntry
                    label={'Created'}
                    id="created"
                    value={dateDiffFromNow(new Date(data.created))}
                    className={styles.splitEntry}
                />
                <InfoEntry
                    label={'Last Updated'}
                    id="updated"
                    value={dateDiffFromNow(new Date(data.updated))}
                    className={styles.splitEntry}
                />
            </div>
        </Card>
    );
};

export default RepositoryCard;
