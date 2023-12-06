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

    const handleClick = (event: any, tagType: TagTypes) => {
        const tag = event?.target.innerText;

        let currValue = search[tagType] || [];
        if (!Array.isArray(currValue)) {
            currValue = [currValue];
        }
        if (currValue.length) {
            const index = currValue.indexOf(tag);
            if (index > -1) {
                currValue.splice(index, 1);
            } else {
                currValue.push(tag);
            }
        } else {
            currValue.push(tag);
        }

        const newState = { ...search, [tagType]: currValue };
        setSearch(newState);
        // Update query params in router
        routerPush(`/tools?${objectToQueryString(newState)}`, undefined, {
            shallow: true,
        });
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
