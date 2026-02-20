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
import { Button } from '@components/elements';

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
    const { frontMatter, content } = getParsedFileContentBySlug(
        params?.slug?.toString() || '',
    );
    const renderedHTML = markdownToHtml(content);

    // Get date from frontmatter
    const articleDate = new Date(frontMatter.date);

    const prev = getPreviousArticle(
        params?.slug?.toString() || '',
        articleDate,
    );

    const sponsors = getSponsors();

    return {
        props: {
            sponsors,
            frontMatter: frontMatter,
            html: renderedHTML,
            prev: prev || null,
        },
    };
};

export interface BlogPostPageProps extends MarkdownRenderingResult {
    sponsors: SponsorData[];
}

const BlogPostPage: FC<BlogPostPageProps> = ({
    sponsors,
    frontMatter,
    html,
    prev,
}) => {
    const title = `${frontMatter.title} | Analysis Tools`;
    const description =
        'Our blog is a place where we share our thoughts on the latest trends in the static analysis tools industry.';

    const navigateBack = () => {
        window.history.back();
    };

    return (
        <>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <BlogSidebar sponsors={sponsors} />
                    <Panel>
                        <Button onClick={navigateBack} theme="link">
                            Back
                        </Button>
                        <BlogPostLayout
                            frontMatter={frontMatter}
                            html={html}
                            prev={prev}
                        />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorMessage />
            <Footer />
        </>
    );
};

// Get the slug for the previous article (by date from frontmatter) in the same
// directory (if it exists)
function getPreviousArticle(slug: string, articleDate: Date) {
    return readdirSync(POSTS_PATH)
        .filter((file) => file.indexOf('.md') > -1)
        .map((path) => path.replace(/\.md?$/, ''))
        .map((slug) => {
            const { frontMatter } = getParsedFileContentBySlug(slug);

            // Convert frontmatter date in format "2020-07-16T22:12:03.284Z"
            // to a date object
            const date = new Date(frontMatter.date);

            return {
                slug,
                title: frontMatter.title,
                date,
            };
        })
        .filter((post) => post.date < articleDate)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .map((post) => {
            return {
                slug: post.slug,
                title: post.title,
            };
        })[0];
}

export default BlogPostPage;
