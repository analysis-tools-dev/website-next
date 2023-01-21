import { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorBanner } from '@components/core';
import { Main, Panel, Sidebar, Wrapper } from '@components/layout';
import { LanguageCard, AlternateToolsList, Tool } from '@components/tools';
import { SearchProvider } from 'context/SearchProvider';
import { Article, LanguageData, SponsorData } from 'utils/types';
import { getArticles } from 'utils-api/blog';
import { getLanguageData, getTags } from 'utils-api/tags';
import { filterByTags } from 'utils-api/filters';
import { BlogPreview } from '@components/blog';
import { Newsletter } from '@components/elements';
import { getSponsors } from 'utils-api/sponsors';
import { getToolsWithVotes } from 'utils-api/toolsWithVotes';

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
    // Call an external API endpoint to get tools
    const data = await getTags('all');

    if (!data) {
        return { paths: [], fallback: false };
    }

    // Get the paths we want to pre-render based on the tags API response
    const paths = data.map((tag) => {
        return {
            params: { slug: tag.tag },
        };
    });

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug?.toString();
    if (!slug || slug === '') {
        return {
            notFound: true,
        };
    }

    const tagData = await getLanguageData(slug);
    const tools = await getToolsWithVotes();
    const articles = await getArticles();
    const sponsors = getSponsors();

    const filteredTools = filterByTags(tools, slug);

    return {
        props: {
            slug,
            tag: tagData,
            tools: filteredTools,
            articles,
            sponsors,
        },
    };
};

export interface TagProps {
    slug: string;
    tag: LanguageData;
    tools: Tool[];
    articles: Article[];
    sponsors: SponsorData[];
}

const TagPage: FC<TagProps> = ({ slug, tag, tools, articles, sponsors }) => {
    const title = `${tag.name} Static Analysis Tools - Analysis Tools`;
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <SearchProvider>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <Sidebar className="bottomSticky">
                        <BlogPreview articles={articles} />
                        <Newsletter />
                    </Sidebar>
                    <Panel>
                        <LanguageCard tag={slug} tagData={tag} />
                        <AlternateToolsList tools={tools} />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorBanner sponsors={sponsors} />
            <Footer />
        </SearchProvider>
    );
};

export default TagPage;
