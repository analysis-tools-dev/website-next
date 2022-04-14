import { FC } from 'react';
import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { GetServerSideProps } from 'next';
import {
    APIPaths,
    getApiURLFromContext,
    getBaseApiURLFromContext,
} from 'utils-api/urls';
import {
    Tool,
    ToolInfoCard,
    ToolInfoSidebar,
    ToolsList,
} from '@components/tools';
import { type Article } from 'utils/types';

interface ToolPageProps {
    tool: Tool;
    alternateTools: Tool[];
    articles: Article[];
}

// TODO: Add fallback pages instead of 404, maybe says tool not found and asks user if they would like to add it?
export const getServerSideProps: GetServerSideProps<ToolPageProps> = async (
    ctx,
) => {
    const { slug } = ctx.query;
    if (!slug || slug === '') {
        return {
            notFound: true,
        };
    }

    // Fetch Tool data from API
    const baseApiUrl = getBaseApiURLFromContext(ctx);

    const toolPath = `${APIPaths.TOOL}/${slug.toString()}`;
    const toolAPIURL = `${baseApiUrl}/${toolPath}`;

    const articlesApiURL = `${baseApiUrl}/${APIPaths.BLOG}`;

    // Fetch tool data from API
    const toolRes = await fetch(toolAPIURL);
    const tool = await toolRes.json();

    // Fetch article data from API
    const articleRes = await fetch(articlesApiURL);
    const articles = await articleRes.json();

    if (tool.error || articles.error) {
        return {
            notFound: true,
        };
    }

    //TODO: Create util function to retrieve and validate Alternate Tools data
    // Fetch Alternate Tools from API
    const parsedQuery = {
        languages: (tool as Tool).languages,
    };
    const alternatesAPIURL = getApiURLFromContext(
        ctx,
        APIPaths.TOOLS,
        parsedQuery,
    );
    const results = await fetch(alternatesAPIURL);
    const alternateTools = await results.json();

    return { props: { tool, alternateTools, articles } };
};

const ToolPage: FC<ToolPageProps> = ({ tool, alternateTools, articles }) => {
    // TODO: Update title and description to include tool
    const title = 'Analysis Tools';
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <ToolInfoSidebar tool={tool} articles={articles} />
                    <Panel>
                        <ToolInfoCard tool={tool} />

                        {alternateTools && (
                            <ToolsList
                                heading={`${tool.name} alternative static tools`}
                            />
                        )}
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorCard />
            <Footer />
        </>
    );
};

export default ToolPage;
