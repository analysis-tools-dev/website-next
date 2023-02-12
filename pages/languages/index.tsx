import { FC } from 'react';
import type { GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorBanner } from '@components/core';
import { Main, Panel, Sidebar, Wrapper } from '@components/layout';
import { PopularToolsByLanguage } from '@components/homepage';
import { BlogPreview } from '@components/blog';
import { Newsletter } from '@components/elements';
import { Article, SponsorData } from 'utils/types';
import { ToolsByLanguage } from '@components/tools';
import { getArticles } from 'utils-api/blog';
import { getPopularLanguageStats } from 'utils-api/popularLanguageStats';
import { getSponsors } from 'utils-api/sponsors';

export const getStaticProps: GetStaticProps = async () => {
    const sponsors = getSponsors();
    const articles = await getArticles();
    const popularLanguages = await getPopularLanguageStats();

    return {
        props: {
            sponsors,
            articles,
            popularLanguages,
        },
    };
};
export interface LanguagesPageProps {
    sponsors: SponsorData[];
    articles: Article[];
    popularLanguages: ToolsByLanguage;
}

const LagnuagesPage: FC<LanguagesPageProps> = ({
    sponsors,
    articles,
    popularLanguages,
}) => {
    const title = 'Popular Static Analysis Tools by Language - Analysis Tools';
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <>
            <MainHead title={title} description={description} />
            <Navbar />

            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <Sidebar className="topSticky">
                        <BlogPreview articles={articles} />
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

export default LagnuagesPage;
