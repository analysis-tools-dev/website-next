import { FC, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import styles from './TagList.module.css';
import { TagTypes, useSearchState } from 'context/SearchProvider';
import { objectToQueryString } from 'utils/query';
import { useRouterPush } from 'hooks';
import classNames from 'classnames';
import { tagIconPath } from 'utils/icons';

const NUM_TAGS = 8;

export interface TagListProps {
    languageTags?: string[];
    otherTags?: string[];
    className?: string;
}

const TagList: FC<TagListProps> = ({ languageTags, otherTags, className }) => {
    const routerPush = useRouterPush();
    const { search, setSearch } = useSearchState();
    const [showAllTags, setShowAllTags] = useState(false);

    const toggleShowAllTags = () => {
        setShowAllTags((prevShowAllTags) => !prevShowAllTags);
    };

    const toggleTag = (event: any, tagType: TagTypes) => {
        const tag = event?.target.innerText;
        const currentTags = search[tagType];

        if (Array.isArray(currentTags)) {
            if (currentTags.includes(tag)) {
                setSearch({
                    ...search,
                    [tagType]: currentTags.filter((l: string) => l !== tag),
                });
            } else {
                setSearch({
                    ...search,
                    [tagType]: [...currentTags, tag],
                });
            }
        } else {
            setSearch({
                ...search,
                [tagType]: [tag],
            });
        }

        routerPush(
            `/tools?${objectToQueryString(search as Record<string, any>)}`,
            undefined,
            {
                shallow: true,
            },
        );
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
                        [`${styles.highlight}`]: search[type]?.includes(tag),
                    })}
                    key={`${tag}-${index}`}>
                    <a onClick={(e) => toggleTag(e, type)}>
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
                    className={classNames(styles.tag, styles.showMore)}>
                    {showAllTags ? 'Show less' : 'Show more'}
                </li>
            )}
        </ul>
    ) : null;
};

export default TagList;
