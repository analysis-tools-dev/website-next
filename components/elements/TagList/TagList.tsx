import { FC } from 'react';
import cn from 'classnames';
import styles from './TagList.module.css';
import { useSearchState } from 'context/SearchProvider';
import { objectToQueryString } from 'utils/query';
import { useRouterPush } from 'hooks';
import classNames from 'classnames';

export interface TagListProps {
    languageTags: string[];
    otherTags?: string[];
    className?: string;
}

const TagList: FC<TagListProps> = ({ languageTags, otherTags, className }) => {
    const routerPush = useRouterPush();
    const { search, setSearch } = useSearchState();
    const toggleLanguageTag = (event) => {
        const language = event?.target.innerText;
        if (Array.isArray(search.languages)) {
            // remove language tag if already in array
            if (search.languages.includes(language)) {
                setSearch({
                    ...search,
                    languages: search.languages.filter((l) => l !== language),
                });
            } else {
                // Add language tag if not in array
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
    const toggleOtherTag = (event) => {
        const other = event?.target.innerText;
        if (Array.isArray(search.others)) {
            // remove other tag if already in array
            if (search.others.includes(other)) {
                setSearch({
                    ...search,
                    others: search.others.filter((l) => l !== other),
                });
            } else {
                // Add other tag if not in array
                setSearch({
                    ...search,
                    others: [...search.others, other],
                });
            }
        } else {
            // If single other tag, set to array
            setSearch({
                ...search,
                others: [other],
            });
        }

        routerPush(`/tools?${objectToQueryString(search)}`, undefined, {
            shallow: true,
        });
    };

    return (languageTags && languageTags.length) ||
        (otherTags && otherTags.length) ? (
        <ul className={cn(styles.tagList, className)}>
            {languageTags.map((tag, index) => (
                <li
                    className={classNames(styles.tag, {
                        [`${styles.highlight}`]:
                            search.languages?.includes(tag),
                    })}
                    key={`languageTag-${index}`}>
                    <a onClick={toggleLanguageTag}>{tag}</a>
                </li>
            ))}
            {otherTags &&
                otherTags.map((tag, index) => (
                    <li
                        className={classNames(styles.tag, {
                            [`${styles.highlight}`]:
                                search.others?.includes(tag),
                        })}
                        key={`otherTag-${index}`}>
                        <a onClick={toggleOtherTag}>{tag}</a>
                    </li>
                ))}
        </ul>
    ) : null;
};

export default TagList;
