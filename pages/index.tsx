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
import { ArticlePreview, Faq, SponsorData } from 'utils/types';
import { Tool, ToolsByLanguage } from '@components/tools';
import { getArticlesPreviews } from 'utils-api/blog';
import { getSponsors } from 'utils-api/sponsors';
import { getFaq } from 'utils-api/faq';
import { StatsRepository } from '@lib/repositories';

export const getStaticProps: GetStaticProps = async () => {
    const sponsors = getSponsors();
    const faq = getFaq();
    const previews = await getArticlesPreviews();

    const statsRepo = StatsRepository.getInstance();

    // Votes are now included in static tools.json data
    const popularLanguages = statsRepo.getPopularLanguageStats();
    const mostViewed = statsRepo.getMostViewedTools();

    return {
        props: {
            sponsors,
            faq,
            previews,
            popularLanguages,
            mostViewed,
        },
    };
};

export interface HomePageProps {
    sponsors: SponsorData[];
    faq: Faq[];
    previews: ArticlePreview[];
    popularLanguages: ToolsByLanguage;
    mostViewed: Tool[];
}

const HomePage: FC<HomePageProps> = ({
    sponsors,
    faq,
    previews,
    popularLanguages,
    mostViewed,
}) => {
    const title =
        'Analysis Tools and Linters to Improve Code Quality and Avoid Bugs';
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
                        <BlogPreview previews={previews} />
                        <Newsletter />
                    </Sidebar>
                    <Panel>
                        {popularLanguages && (
                            <PopularToolsByLanguage
                                toolsByLanguage={popularLanguages}
                            />
                        )}
                        {mostViewed && <MostViewedTools tools={mostViewed} />}
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
