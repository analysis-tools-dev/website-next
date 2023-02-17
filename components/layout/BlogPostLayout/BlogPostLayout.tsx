import { FC } from 'react';
import styles from './BlogPostLayout.module.css';
import { type FrontMatter } from 'utils/types';
import { Card } from '../Card';
import { Heading } from '@components/typography';

export interface BlogPostLayoutProps {
    meta: FrontMatter;
    html: string;
}

const BlogPostLayout: FC<BlogPostLayoutProps> = ({ meta, html }) => {
    const articleDate = new Date(meta.date);
    return (
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
    );
};

export default BlogPostLayout;
