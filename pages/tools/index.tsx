import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { SearchProvider } from 'context/SearchProvider';

import { Footer, Navbar, SponsorBanner } from '@components/core';
import { Main, Wrapper } from '@components/layout';
import { prefetchLanguages } from '@components/tools/queries/languages';
import { fetchArticles } from '@components/blog/queries/articles';
import { QUERY_CLIENT_DEFAULT_OPTIONS } from 'utils/constants';
import { Article, SponsorData } from 'utils/types';
import { prefetchTools } from '@components/tools/queries';
import { ListPageComponent } from '@components/tools';
import { getSponsors } from 'utils-api/sponsors';
import { MobileFilters } from '@components/tools/listPage';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const sponsors = getSponsors();
    const articles = await fetchArticles();

    // Create a new QueryClient instance for each page request.
    // This ensures that data is not shared between users and requests.
    const queryClient = new QueryClient(QUERY_CLIENT_DEFAULT_OPTIONS);
    await prefetchLanguages(queryClient);
    await prefetchTools(queryClient, ctx.query);

    return {
        props: {
            sponsors,
            articles,
            dehydratedState: dehydrate(queryClient),
        },
    };
};

export interface ToolsProps {
    sponsors: SponsorData[];
    articles: Article[];
}

const ToolsPage: FC<ToolsProps> = ({ sponsors, articles }) => {
    return (
        <SearchProvider>
            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <ListPageComponent articles={articles} />
                </Main>
            </Wrapper>

            <SponsorBanner sponsors={sponsors} />
            <Footer />
        </SearchProvider>
    );
};

export default ToolsPage;
