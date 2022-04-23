import { FC } from 'react';
import { type GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { SearchProvider } from 'context/SearchProvider';

import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { ToolsSidebar, ToolsList } from '@components/tools';
import { prefetchLanguages } from '@components/tools/queries/languages';
import { prefetchTools } from '@components/tools/queries';
import { prefetchArticles } from '@components/blog/queries/articles';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // Create a new QueryClient instance for each page request.
    // This ensures that data is not shared between users and requests.
    const queryClient = new QueryClient();

    await prefetchTools(queryClient, ctx.query);
    await prefetchLanguages(queryClient);
    await prefetchArticles(queryClient);

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

const ToolsPage: FC = () => {
    // TODO: Update title and description to include language or filters
    const title = 'Analysis Tools';
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <SearchProvider>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <ToolsSidebar />
                    <Panel>
                        {/* <LanguageCard language={languages[0]} /> */}
                        <ToolsList heading={`Static analysis tools`} />
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
        </SearchProvider>
    );
};

export default ToolsPage;
