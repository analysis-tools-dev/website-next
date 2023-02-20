import { FC } from 'react';
import type { GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorBanner, FAQ } from '@components/core';
import { Main, Panel, Sidebar, Wrapper } from '@components/layout';
import {
    Intro,
    MostViewedTools,
    PopularToolsByLanguage,
} from '@components/homepage';
import { BlogPreview } from '@components/blog';
import { Newsletter } from '@components/elements';

import homepageData from '@appdata/homepage.json';
import { Article, Faq, SponsorData } from 'utils/types';
import { Tool, ToolsByLanguage } from '@components/tools';
import { getArticles } from 'utils-api/blog';
import { getPopularLanguageStats } from 'utils-api/popularLanguageStats';
import { getMostViewedTools } from 'utils-api/mostViewedTools';
import { getSponsors } from 'utils-api/sponsors';
import { getFaq } from 'utils-api/faq';

export const getStaticProps: GetStaticProps = async () => {
    const sponsors = getSponsors();
    const faq = getFaq();
    const articles = await getArticles();
    const popularLanguages = await getPopularLanguageStats();
    const mostViewed = await getMostViewedTools();

    return {
        props: {
            sponsors,
            faq,
            articles,
            popularLanguages,
            mostViewed,
        },
    };
};
export interface HomePageProps {
    sponsors: SponsorData[];
    faq: Faq[];
    articles: Article[];
    popularLanguages: ToolsByLanguage;
    mostViewed: Tool[];
}

const HomePage: FC<HomePageProps> = ({
    sponsors,
    faq,
    articles,
    popularLanguages,
    mostViewed,
}) => {
    const title =
        'Static Analysis Tools And Linters To Avoid Bugs And Improve Code Quality';
    return (
        <>
            <MainHead
                title={title}
                description={homepageData.meta.description}
            />

            <Navbar />

            <Intro />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <Sidebar className="topSticky">
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

            <FAQ faq={faq} />

            <SponsorBanner sponsors={sponsors} />
            <Footer />
        </>
    );
};

export default HomePage;
