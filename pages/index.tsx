import { FC } from 'react';
import type { GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Sidebar, Wrapper } from '@components/layout';
import {
    Intro,
    MostViewedTools,
    PopularToolsByLanguage,
} from '@components/homepage';
import { BlogPreview } from '@components/blog';
import { Newsletter } from '@components/elements';

import homepageData from '@appdata/homepage.json';
import { Article } from 'utils/types';
import { Tool, ToolsByLanguage } from '@components/tools';
import { getArticles } from 'utils-api/blog';
import { getPopularLanguageStats } from 'utils-api/popularLanguageStats';
import { getMostViewedTools } from 'utils-api/mostViewedTools';

export const getStaticProps: GetStaticProps = async () => {
    const articles = await getArticles();
    const popularLanguages = await getPopularLanguageStats();
    const mostViewed = await getMostViewedTools();

    return {
        props: {
            articles,
            popularLanguages,
            mostViewed,
        },
    };
};
export interface HomePageProps {
    articles: Article[];
    popularLanguages: ToolsByLanguage;
    mostViewed: Tool[];
}

const HomePage: FC<HomePageProps> = ({
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
                            toolsByLangauge={popularLanguages}
                        />
                        <MostViewedTools tools={mostViewed} />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorCard />
            <Footer />
        </>
    );
};

export default HomePage;
