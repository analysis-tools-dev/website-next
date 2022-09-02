import { FC, useEffect } from 'react';
import cn from 'classnames';
import styles from './TagList.module.css';
import { useSearchState } from 'context/SearchProvider';
import Link from 'next/link';
import { objectToQueryString } from 'utils/query';
import { useRouterPush } from 'hooks';

export interface TagListProps {
    tags: string[];
    className?: string;
}

const TagList: FC<TagListProps> = ({ tags, className }) => {
    const routerPush = useRouterPush();
    const { search, setSearch } = useSearchState();
    const changeLanguage = (event) => {
        const language = event?.target.innerText;
        if (Array.isArray(search.languages)) {
            // remove language tag if already in array
            if (search.languages.includes(language)) {
                setSearch({
                    ...search,
                    languages: search.languages.filter((l) => l !== language),
                });
            } else {
                // Add langauge tag if not in array
                setSearch({
                    ...search,
                    languages: [...search.languages, language],
                });
            }
        } else {
            // If single language tag, set to array
            setSearch({
                ...search,
                languages: [language],
            });
        }

        routerPush(`/tools?${objectToQueryString(search)}`, undefined, {
            shallow: true,
        });
    };

    return tags && tags.length ? (
        <ul className={cn(styles.tagList, className)}>
            {tags.map((tag, index) => (
                <li className={styles.tag} key={`tag-${index}`}>
                    <a onClick={changeLanguage}>{tag}</a>
                </li>
            ))}
        </ul>
    ) : null;
};

export default TagList;
