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
import { SponsorData, type MarkdownRenderingResult } from 'utils/types';
import { BlogSidebar } from '@components/blog';
import { getSponsors } from 'utils-api/sponsors';

interface ArticleProps extends ParsedUrlQuery {
    slug: string;
}

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

export const getStaticProps: GetStaticProps<MarkdownRenderingResult> = ({
    params,
}) => {
    const articleMarkdownContent = getParsedFileContentBySlug(
        params?.slug?.toString() || '',
    );

    const renderedHTML = markdownToHtml(articleMarkdownContent.content);

    const sponsors = getSponsors();

    return {
        props: {
            sponsors,
            frontMatter: articleMarkdownContent.frontMatter,
            html: renderedHTML,
        },
    };
};

export interface BlogPostPageProps extends MarkdownRenderingResult {
    sponsors: SponsorData[];
}

// TODO: Add BreadCrumbs
// TODO: Add next/prev article links
const BlogPostPage: FC<BlogPostPageProps> = ({
    sponsors,
    frontMatter,
    html,
}) => {
    const title = `${frontMatter.title} | Analysis Tools`;
    const description =
        'Our blog is a place where we share our thoughts on the latest trends in the static analysis tools industry.';

    return (
        <>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <BlogSidebar sponsors={sponsors} />
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
