import { FC } from 'react';
import type { GetStaticProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Sidebar, Wrapper } from '@components/layout';
import {
    Intro,
    MostViewedTools,
    PopularToolsByLanguage,
} from '@components/homepage';
import { BlogPreview } from '@components/blog';
import { Newsletter } from '@components/elements';
import { fetchArticles } from '@components/blog/queries/articles';
import { prefetchMostViewed } from '@components/homepage/queries/mostViewed';
import { prefetchPopularLanguages } from '@components/homepage/queries/popularLanguages';

import homepageData from '@appdata/homepage.json';
import { QUERY_CLIENT_DEFAULT_OPTIONS } from 'utils/constants';
import { Article } from 'utils/types';

export const getStaticProps: GetStaticProps = async () => {
    // Create a new QueryClient instance for each page request.
    // This ensures that data is not shared between users and requests.
    const queryClient = new QueryClient(QUERY_CLIENT_DEFAULT_OPTIONS);

    await prefetchMostViewed(queryClient);
    await prefetchPopularLanguages(queryClient);
    // const articles = await fetchArticles();
    const articles: Article[] = [];

    return {
        props: {
            articles: articles,
            dehydratedState: dehydrate(queryClient),
        },
    };
};

export interface HomePageProps {
    articles: Article[];
}

const HomePage: FC<HomePageProps> = ({ articles }) => {
    return (
        <>
            <MainHead
                title={homepageData.meta.title}
                description={homepageData.meta.description}
            />

            <Navbar />

            <Intro />
            <Wrapper>
                <Main className="m-b-30">
                    <Sidebar className="bottomSticky">
                        <BlogPreview articles={articles} />
                        <Newsletter />
                    </Sidebar>
                    <Panel>
                        <PopularToolsByLanguage />
                        <MostViewedTools />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorCard />
            <Footer />
        </>
    );
};

export default HomePage;
