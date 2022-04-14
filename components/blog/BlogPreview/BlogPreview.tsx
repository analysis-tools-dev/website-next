import { FC } from 'react';
import Link from 'next/link';

import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import BlogPreviewEntry from '../BlogPreviewEntry/BlogPreviewEntry';
import { useArticlesQuery } from '../api-utils';

const BlogPreview: FC = () => {
    const articlesResult = useArticlesQuery();
    if (articlesResult.error || !articlesResult.data) {
        return null;
    }

    return (
        <Card className="m-b-30">
            <Heading level={3} className="m-b-16 font-bold">
                Latest from our Blog
            </Heading>
            {articlesResult.data.map((post, index) => (
                <BlogPreviewEntry
                    key={index}
                    title={post.meta?.title}
                    summary={post.summary}
                    link={`/blog/${post.slug}`}
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
