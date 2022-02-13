import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import Link from 'next/link';
import { FC } from 'react';
import BlogPreviewEntry from '../BlogPreviewEntry/BlogPreviewEntry';

const BlogPreview: FC = () => {
    const blogPosts = [
        {
            title: 'Picking the Right Static Analysis Tool For Your Use-Case',
            text: `This project started as a way to scratch my own itch: "How do I find the best static analysis tool for my use-case?" Years later, many`,
            link: '/',
        },
        {
            title: 'Picking the Right Static Analysis Tool For Your Use-Case',
            text: `This project started as a way to scratch my own itch: "How do I find the best static analysis tool for my use-case?" Years later, many`,
            link: '/',
        },
    ];
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
