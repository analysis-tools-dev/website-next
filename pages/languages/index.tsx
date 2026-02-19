import { FC } from 'react';
import type { GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorBanner } from '@components/core';
import { Main, Panel, Sidebar, Wrapper } from '@components/layout';
import { PopularToolsByLanguage } from '@components/homepage';
import { BlogPreview } from '@components/blog';
import { Newsletter } from '@components/elements';
import { Article, SponsorData } from 'utils/types';
import { ToolsByLanguage } from '@components/tools';
import { getArticlesPreviews } from 'utils-api/blog';
import { getSponsors } from 'utils-api/sponsors';
import { StatsRepository, VotesRepository } from '@lib/repositories';

export const getStaticProps: GetStaticProps = async () => {
    const sponsors = getSponsors();
    const previews = getArticlesPreviews();

    const votesRepo = VotesRepository.getInstance();
    const statsRepo = StatsRepository.getInstance();

    const votes = await votesRepo.fetchAll();
    const popularLanguages = statsRepo.getPopularLanguageStats(votes);

    return {
        props: {
            sponsors,
            previews: previews,
            popularLanguages,
        },
    };
};
export interface LanguagesPageProps {
    sponsors: SponsorData[];
    previews: Article[];
    popularLanguages: ToolsByLanguage;
}

const LanguagesPage: FC<LanguagesPageProps> = ({
    sponsors,
    previews,
    popularLanguages,
}) => {
    const title =
        'Popular Static/Dynamic Analysis Tools by Language | Analysis Tools';

    const description = `Find the most popular static and dynamic analysis tools for your favorite programming language.`;

    return (
        <>
            <MainHead title={title} description={description} />
            <Navbar />

            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <Sidebar className="topSticky">
                        <BlogPreview previews={previews} />
                        <Newsletter />
                    </Sidebar>
                    <Panel>
                        <PopularToolsByLanguage
                            toolsByLanguage={popularLanguages}
                            limit={999}
                        />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorBanner sponsors={sponsors} />
            <Footer />
        </>
    );
};

export default LanguagesPage;
