import { FC } from 'react';
import Link from 'next/link';
import { PanelHeader } from '@components/elements';
import styles from './BlogPreviewEntry.module.css';
import classNames from 'classnames';

export interface BlogPreviewEntryProps {
    title: string;
    summary: string;
    link: string;
    className?: string;
}

const BlogPreviewEntry: FC<BlogPreviewEntryProps> = ({
    title,
    summary,
    link,
    className,
}) => {
    return (
        <div className={classNames(styles.previewCard, className)}>
            <PanelHeader
                level={4}
                text={title}
                headingClass="font-size-15"
                className="m-b-8"
            />
            <div
                className="font-light font-size-s m-t-16"
                dangerouslySetInnerHTML={{ __html: summary }}
            />
            <Link href={link}>
                <a className="font-light font-size-s m-t-16 inline">
                    Read more
                </a>
            </Link>
        </div>
    );
};

export default BlogPreviewEntry;
