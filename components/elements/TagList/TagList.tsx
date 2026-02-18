import { FC, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import styles from './TagList.module.css';
import { useTools } from 'context/ToolsProvider';
import classNames from 'classnames';
import { tagIconPath } from 'utils/icons';

// Tag type for filtering
type TagTypes = 'languages' | 'others';

const NUM_TAGS = 8;

export interface TagListProps {
    languageTags?: string[];
    otherTags?: string[];
    className?: string;
}

const TagList: FC<TagListProps> = ({ languageTags, otherTags, className }) => {
    const { toggleFilter, isSelected } = useTools();
    const [showAllTags, setShowAllTags] = useState(false);

    const toggleShowAllTags = () => {
        setShowAllTags((prevShowAllTags) => !prevShowAllTags);
    };

    const handleClick = (
        event: React.MouseEvent<HTMLElement>,
        tagType: TagTypes,
    ) => {
        const target = event?.target as HTMLElement;
        const tag = target.innerText;
        toggleFilter(tagType, tag);
    };

    const isTagSelected = (tag: string, type: TagTypes): boolean => {
        return isSelected(type, tag);
    };

    const combinedTags = [
        ...(languageTags || []).map((tag) => ({
            tag,
            type: 'languages' as TagTypes,
        })),
        ...(otherTags || []).map((tag) => ({
            tag,
            type: 'others' as TagTypes,
        })),
    ];

    const tagsToRender = showAllTags
        ? combinedTags
        : combinedTags.slice(0, NUM_TAGS);

    return combinedTags.length ? (
        <ul className={cn(styles.tagList, className)}>
            {tagsToRender.map(({ tag, type }, index) => (
                <li
                    className={classNames(styles.tag, {
                        [`${styles.highlight}`]: isTagSelected(tag, type),
                    })}
                    key={`${tag}-${index}`}>
                    <a onClick={(e) => handleClick(e, type)}>
                        <Image
                            className={styles.tagIcon}
                            src={tagIconPath(tag)}
                            alt={tag}
                            width={15}
                            height={15}
                        />
                        {tag}
                    </a>
                </li>
            ))}

            {combinedTags.length > NUM_TAGS && (
                <li
                    onClick={toggleShowAllTags}
                    className={classNames(styles.showMore)}>
                    {showAllTags ? 'less' : 'more'}
                </li>
            )}
        </ul>
    ) : null;
};

export default TagList;
