import { FC } from 'react';
import classNames from 'classnames';
import styles from './BlogPostLayout.module.css';
import { Heading } from '@components/typography';
import { type FrontMatter } from 'utils/types';

export interface BlogPostLayoutProps {
    meta: FrontMatter;
    html: any;
}

const BlogPostLayout: FC<BlogPostLayoutProps> = ({ meta, html }) => {
    return (
        <div className={classNames(styles.wrapper)}>
            <Heading level={2}>{meta.title}</Heading>

            <main dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
};

export default BlogPostLayout;
