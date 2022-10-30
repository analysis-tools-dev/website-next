import { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorBanner } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import {
    Tool,
    ToolInfoCard,
    ToolInfoSidebar,
    ToolsList,
} from '@components/tools';
import { SearchProvider } from 'context/SearchProvider';
import { getTools } from 'utils-api/tools';
import { Article } from 'utils/types';
import { containsArray } from 'utils/arrays';
import { getArticles } from 'utils-api/blog';
import { getTags } from 'utils-api/tags';

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
    // Call an external API endpoint to get tools
    const data = await getTags();

    if (!data) {
        return { paths: [], fallback: false };
    }

    // Get the paths we want to pre-render based on the tags API response
    const paths = Object.keys(data).map((id) => ({
        params: { slug: id },
    }));

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

    const tools = await getTools();

    // filter tools by tag
    const filteredTools =
        tools &&
        Object.keys(tools).filter((key) => {
            const tool = tools[key];
            return (
                containsArray(tool.languages, slug) ||
                containsArray(tool.other, slug)
            );
        });

    const articles = await getArticles();

    const tag = {
        id: slug,
        tools: filteredTools,
    };

    return {
        props: {
            tools,
            articles,
        },
    };
};

export interface TagProps {
    tag: any;
    tools: Tool[];
    articles: Article[];
}

const ToolPage: FC<TagProps> = ({ tag, tools, articles }) => {
    const title = `${tag.name} - Analysis Tools`;
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <SearchProvider>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <ListPageComponent articles={articles} />
                </Main>
            </Wrapper>

            <SponsorBanner />
            <Footer />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <Panel>
                        <ToolInfoCard tool={tool} screenshots={screenshots} />

                        <ToolsList tools={alternatives} />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorBanner />
            <Footer />
        </SearchProvider>
    );
};

export default ToolPage;
