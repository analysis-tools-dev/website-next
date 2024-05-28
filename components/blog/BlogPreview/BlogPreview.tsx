import { FC } from 'react';
import Link from 'next/link';

import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import BlogPreviewEntry from '../BlogPreviewEntry/BlogPreviewEntry';
import { ArticlePreview } from 'utils/types';

export interface BlogPreviewProps {
    previews: ArticlePreview[];
}

const BlogPreview: FC<BlogPreviewProps> = ({ previews }) => {
    return (
        <Card>
            <Heading level={3} className="m-b-16 font-bold">
                Latest from our Blog
            </Heading>
            {previews.map((post, index) => (
                <BlogPreviewEntry
                    key={`article-${index}`}
                    meta={post.meta}
                    summary={post.summary}
                    link={`/blog/${post.slug}`}
                    className="m-t-30 m-b-30"
                />
            ))}
            <Link
                href="/blog"
                className="centered font-light font-size-15 underline">
                Show all
            </Link>
        </Card>
    );
};

export default BlogPreview;
