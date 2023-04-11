import { FC, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import styles from './TagList.module.css';
import { useSearchState } from 'context/SearchProvider';
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

    const toggleTag = (event: any, tagType: string) => {
        const tag = event?.target.innerText;

        if (Array.isArray(search[tagType])) {
            if (search[tagType].includes(tag)) {
                setSearch({
                    ...search,
                    [tagType]: search[tagType].filter((l) => l !== tag),
                });
            } else {
                setSearch({
                    ...search,
                    [tagType]: [...search[tagType], tag],
                });
            }
        } else {
            setSearch({
                ...search,
                [tagType]: [tag],
            });
        }

        routerPush(`/tools?${objectToQueryString(search)}`, undefined, {
            shallow: true,
        });
    };

    const combinedTags = [
        ...(languageTags || []).map((tag) => ({ tag, type: 'languages' })),
        ...(otherTags || []).map((tag) => ({ tag, type: 'others' })),
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
