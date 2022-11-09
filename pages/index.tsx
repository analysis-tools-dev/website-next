import { FC } from 'react';
import type { GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorBanner } from '@components/core';
import { Main, Panel, Sidebar, Wrapper } from '@components/layout';
import {
    Intro,
    MostViewedTools,
    PopularToolsByLanguage,
} from '@components/homepage';
import { BlogPreview } from '@components/blog';
import { Newsletter } from '@components/elements';

import homepageData from '@appdata/homepage.json';
import { Article, SponsorData } from 'utils/types';
import { Tool, ToolsByLanguage } from '@components/tools';
import { getArticles } from 'utils-api/blog';
import { getPopularLanguageStats } from 'utils-api/popularLanguageStats';
import { getMostViewedTools } from 'utils-api/mostViewedTools';
import { getSponsors } from 'utils-api/sponsors';

export const getStaticProps: GetStaticProps = async () => {
    const sponsors = getSponsors();
    const articles = await getArticles();
    const popularLanguages = await getPopularLanguageStats();
    const mostViewed = await getMostViewedTools();

    return {
        props: {
            sponsors,
            articles,
            popularLanguages,
            mostViewed,
        },
    };
};
export interface HomePageProps {
    sponsors: SponsorData[];
    articles: Article[];
    popularLanguages: ToolsByLanguage;
    mostViewed: Tool[];
}

const HomePage: FC<HomePageProps> = ({
    sponsors,
    articles,
    popularLanguages,
    mostViewed,
}) => {
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
                        <PopularToolsByLanguage
                            toolsByLanguage={popularLanguages}
                        />
                        <MostViewedTools tools={mostViewed} />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorBanner sponsors={sponsors} />
            <Footer />
        </>
    );
};

export default HomePage;
