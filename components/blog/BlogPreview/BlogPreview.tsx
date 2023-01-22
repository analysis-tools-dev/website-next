import { FC } from 'react';
import Link from 'next/link';

import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import BlogPreviewEntry from '../BlogPreviewEntry/BlogPreviewEntry';
import { Article } from 'utils/types';

export interface BlogPreviewProps {
    articles: Article[];
}

const BlogPreview: FC<BlogPreviewProps> = ({ articles }) => {
    return (
        <Card>
            <Heading level={3} className="m-b-16 font-bold">
                Latest from our Blog
            </Heading>
            {articles.map((post, index) => (
                <BlogPreviewEntry
                    key={index}
                    meta={post.meta}
                    summary={post.summary}
                    link={`/blog/${post.slug}`}
                    className="m-t-30 m-b-30"
                />
            ))}
            <Link href="/blog">
                <a className="centered font-light font-size-15 underline">
                    Show all
                </a>
            </Link>
        </Card>
    );
};

export default BlogPreview;
