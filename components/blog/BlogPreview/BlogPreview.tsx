import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import Link from 'next/link';
import { FC } from 'react';
import BlogPreviewEntry from '../BlogPreviewEntry/BlogPreviewEntry';

import blogPosts from '../../../mockdata/blogPosts.json';

const BlogPreview: FC = () => {
    return (
        <Card className="m-b-30">
            <Heading level={2} className="m-b-16 font-bold">
                Latest from our Blog
            </Heading>
            {blogPosts.map((post, index) => (
                <BlogPreviewEntry
                    key={index}
                    title={post.title}
                    text={post.text}
                    link={post.link}
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
