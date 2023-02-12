import { FC } from 'react';
import Link from 'next/link';
import { PanelHeader } from '@components/elements';
import styles from './BlogPreviewEntry.module.css';
import classNames from 'classnames';
import { FrontMatter } from 'utils/types';

export interface BlogPreviewEntryProps {
    meta: FrontMatter;
    summary: string;
    link: string;
    className?: string;
}

const BlogPreviewEntry: FC<BlogPreviewEntryProps> = ({
    meta,
    summary,
    link,
    className,
}) => {
    const postDate = new Date(meta.date);
    return (
        <div className={classNames(styles.previewCard, className)}>
            <PanelHeader
                level={4}
                text={meta.title}
                headingClass="font-size-15"
                className="m-b-8"
            />
            <p className={styles.postDate}>{postDate.toLocaleDateString()}</p>
            <div
                className={classNames(
                    styles['text-preview'],
                    'font-light font-size-s m-b-8 m-t-8',
                )}
                dangerouslySetInnerHTML={{ __html: summary }}
            />
            <Link href={link}>
                <a className="font-light font-size-s m-t-8 inline">Read more</a>
            </Link>
        </div>
    );
};

export default BlogPreviewEntry;
