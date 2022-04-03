import { FC } from 'react';
import Link from 'next/link';
import { PanelHeader } from '@components/elements';
import styles from './BlogPreviewEntry.module.css';

export interface BlogPreviewEntryProps {
    title: string;
    summary: string;
    link: string;
}

const BlogPreviewEntry: FC<BlogPreviewEntryProps> = ({
    title,
    summary,
    link,
}) => {
    return (
        <div className={styles.previewCard}>
            <PanelHeader
                level={4}
                text={title}
                headingClass="font-size-15"
                className="m-b-8"
            />
            <div
                className="font-light font-size-s"
                dangerouslySetInnerHTML={{ __html: summary }}
            />
            <Link href={link}>
                <a className="font-light font-size-s">Read more</a>
            </Link>
        </div>
    );
};

export default BlogPreviewEntry;
