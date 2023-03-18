import { FC } from 'react';
import styles from './BlogPostLayout.module.css';
import { BlogPostLink, type FrontMatter } from 'utils/types';
import { Card } from '../Card';
import { Heading } from '@components/typography';
import Link from 'next/link';

export interface BlogPostLayoutProps {
    frontMatter: FrontMatter;
    html: string;
    prev?: BlogPostLink;
}

const BlogPostLayout: FC<BlogPostLayoutProps> = ({
    frontMatter: meta,
    html,
    prev,
}) => {
    const articleDate = new Date(meta.date);
    return (
        <>
            <Card>
                <div className={styles.wrapper}>
                    <Heading level={1}>{meta.title}</Heading>
                    <span className={styles.date}>
                        {articleDate.toLocaleDateString()}
                    </span>
                    <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{ __html: html }}></div>
                </div>
            </Card>
            {prev && (
                <div className={styles.prev}>
                    <Heading level={3}>Previous Article:</Heading>
                    <Link href={prev.slug}>{prev.title}</Link>
                </div>
            )}
        </>
    );
};

export default BlogPostLayout;
