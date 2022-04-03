import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { LanguageCard, ToolsSidebar, ToolsList } from '@components/tools';
import { GetServerSideProps } from 'next';

import { Tool } from '@components/tools/types';
import { FC } from 'react';
import {
    APIPaths,
    getApiURLFromContext,
    getBaseApiURLFromContext,
} from 'utils/api';
import { type LanguageTag, type Article } from 'utils/types';

export const getServerSideProps: GetServerSideProps<ToolPageProps> = async (
    ctx,
) => {
    const baseApiUrl = getBaseApiURLFromContext(ctx);
    const toolsApiURL = getApiURLFromContext(ctx, APIPaths.TOOLS); // Builds URL including query params

    const articlesApiURL = `${baseApiUrl}/${APIPaths.BLOG}`;
    const languageTagsApiURL = `${baseApiUrl}/${APIPaths.LANGUAGE_TAGS}`;

    // Fetch article data from API
    const toolsRes = await fetch(toolsApiURL);
    const tools = await toolsRes.json();

    // Fetch article data from API
    const articleRes = await fetch(articlesApiURL);
    const articles = await articleRes.json();

    // Fetch language data from API
    const languageRes = await fetch(languageTagsApiURL);
    const languages = await languageRes.json();

    if (tools.error || articles.error || languages.error) {
        return {
            notFound: true,
        };
    }

    return { props: { tools, articles, languages } };
};

export interface ToolPageProps {
    tools: Tool[];
    articles: Article[];
    languages: LanguageTag[];
}

const ToolsPage: FC<ToolPageProps> = ({ tools, articles, languages }) => {
    // TODO: Redirect 404
    if (!tools) {
        return null;
    }

    // TODO: Update title and description to include language or filters
    const title = 'Analysis Tools';
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <ToolsSidebar languages={languages} articles={articles} />
                    <Panel>
                        {/* <LanguageCard language={languages[0]} /> */}
                        <ToolsList
                            heading={`Static analysis tools`}
                            tools={tools}
                        />
                        {/* 
                        <ToolsList
                            heading={`Multi-language static analysis tools`}
                            tools={[]}
                        /> */}
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorCard />
            <Footer />
        </>
    );
};

export default ToolsPage;
