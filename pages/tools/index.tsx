import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { SearchProvider } from 'context/SearchProvider';

import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Wrapper } from '@components/layout';
import { prefetchLanguages } from '@components/tools/queries/languages';
import { fetchArticles } from '@components/blog/queries/articles';
import { QUERY_CLIENT_DEFAULT_OPTIONS } from 'utils/constants';
import { Article } from 'utils/types';
import { prefetchTools } from '@components/tools/queries';
import { ListPageComponent } from '@components/tools';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const articles = await fetchArticles();

    // Create a new QueryClient instance for each page request.
    // This ensures that data is not shared between users and requests.
    const queryClient = new QueryClient(QUERY_CLIENT_DEFAULT_OPTIONS);
    await prefetchLanguages(queryClient);
    await prefetchTools(queryClient, ctx.query);

    return {
        props: {
            articles,
            dehydratedState: dehydrate(queryClient),
        },
    };
};

export interface ToolsProps {
    articles: Article[];
}

const ToolsPage: FC<ToolsProps> = ({ articles }) => {
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
                    <ListPageComponent articles={articles} />
                </Main>
            </Wrapper>

            <SponsorCard />
            <Footer />
        </SearchProvider>
    );
};

export default ToolsPage;
