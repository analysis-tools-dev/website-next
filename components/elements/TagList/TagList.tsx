import { FC } from 'react';
import cn from 'classnames';
import styles from './TagList.module.css';

export interface TagListProps {
    tags: string[];
    className?: string;
}

const TagList: FC<TagListProps> = ({ tags, className }) => {
    return tags && tags.length ? (
        <ul className={cn(styles.tagList, className)}>
            {tags.map((tag, index) => (
                <li className={styles.tag} key={`tag-${index}`}>
                    {tag}
                </li>
            ))}
        </ul>
    ) : null;
};

export default TagList;
