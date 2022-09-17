import { FC } from 'react';
import { GetStaticProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { SearchProvider } from 'context/SearchProvider';

import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { ToolsSidebar, ToolsList, Tool } from '@components/tools';
import { prefetchLanguages } from '@components/tools/queries/languages';
import { prefetchTools } from '@components/tools/queries';
import { prefetchArticles } from '@components/blog/queries/articles';
import { QUERY_CLIENT_DEFAULT_OPTIONS } from 'utils/constants';
import { getTools } from 'utils-api/tools';
import { ApiTool } from 'utils/types';

export const getStaticProps: GetStaticProps = async (ctx) => {
    // Create a new QueryClient instance for each page request.
    // This ensures that data is not shared between users and requests.
    const queryClient = new QueryClient(QUERY_CLIENT_DEFAULT_OPTIONS);

    const rawTools = await getTools();
    let tools: ApiTool[] = [];
    if (rawTools) {
        tools = Object.entries(rawTools).reduce((acc, [key, value]) => {
            acc.push(value);
            // return acc
            return acc;
        }, [] as ApiTool[]);
    }

    await prefetchLanguages(queryClient);
    await prefetchArticles(queryClient);

    return {
        props: {
            tools,
            dehydratedState: dehydrate(queryClient),
        },
    };
};

export interface ToolsProps {
    tools: Tool[];
}

const ToolsPage: FC<ToolsProps> = ({ tools }) => {
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
                        <ToolsList tools={tools} />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorCard />
            <Footer />
        </SearchProvider>
    );
};

export default ToolsPage;
