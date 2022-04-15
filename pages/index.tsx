import { FC } from 'react';
import type { GetServerSideProps } from 'next';
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
import { fetchMostViewed } from '@components/homepage/queries/mostViewed';

import homepageData from '@appdata/homepage.json';

export const getServerSideProps: GetServerSideProps = async () => {
    // Create a new QueryClient instance for each page request.
    // This ensures that data is not shared between users and requests.
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery('mostViewed', fetchMostViewed);
    await queryClient.prefetchQuery('articles', fetchArticles);

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

const HomePage: FC = () => {
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
                        <BlogPreview />
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
