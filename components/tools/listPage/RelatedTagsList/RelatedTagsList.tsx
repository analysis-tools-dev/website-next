import { FC } from 'react';
import { PanelHeader } from '@components/elements';
import { TagWidget } from '@components/widgets/TagWidget';
import styles from './RelatedTagsList.module.css';

interface RelatedTagsListProps {
    tags: string[];
}

export const RelatedTagsList: FC<RelatedTagsListProps> = ({ tags }) => {
    return (
        <>
            <PanelHeader level={2} text="Related Tags" />
            <div className={styles.tagsList}>
                {tags.map((tag) => {
                    return <TagWidget key={`related-${tag}`} tag={tag} />;
                })}
            </div>
        </>
    );
};
