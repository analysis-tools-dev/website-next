import { FC } from 'react';
import { MainHead, Footer, Navbar, SponsorMessage } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';

import { BlogPostLayout } from '@components/layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { readdirSync } from 'fs';
import {
    POSTS_PATH,
    markdownToHtml,
    getParsedFileContentBySlug,
} from 'utils-api/blog';
import { type MarkdownRenderingResult } from 'utils/types';
import { BlogSidebar } from '@components/blog';

interface ArticleProps extends ParsedUrlQuery {
    slug: string;
}

export const getStaticProps: GetStaticProps<MarkdownRenderingResult> = ({
    params,
}) => {
    const articleMarkdownContent = getParsedFileContentBySlug(
        params?.slug?.toString() || '',
    );

    const renderedHTML = markdownToHtml(articleMarkdownContent.content);

    return {
        props: {
            frontMatter: articleMarkdownContent.frontMatter,
            html: renderedHTML,
        },
    };
};

export const getStaticPaths: GetStaticPaths<ArticleProps> = () => {
    const paths = readdirSync(POSTS_PATH)
        // Filter anything other than .md files
        .filter((file) => file.indexOf('.md') > -1)
        // Remove file extensions for page paths
        .map((path) => path.replace(/\.md?$/, ''))
        // Map the path into the static paths object required by Next.js
        .map((slug) => ({ params: { slug } }));

    return {
        paths,
        fallback: false,
    };
};

// TODO: Add BreadCrumbs
// TOOD: Add next/prev article links
const BlogPostPage: FC<MarkdownRenderingResult> = ({ frontMatter, html }) => {
    const title = 'Analysis Tools';
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <BlogSidebar />
                    <Panel>
                        <BlogPostLayout meta={frontMatter} html={html} />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorMessage />
            <Footer />
        </>
    );
};

export default BlogPostPage;
