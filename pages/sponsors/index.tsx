import { FC } from 'react';
import type { GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorMessage } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { Intro, SponsorSidebar, SponsorsList } from '@components/sponsors';
import { Article, SponsorData } from 'utils/types';
import { getArticles } from 'utils-api/blog';
import { getSponsors } from 'utils-api/sponsors';

export const getStaticProps: GetStaticProps = async () => {
    const sponsors = getSponsors();
    const articles = await getArticles();

    return {
        props: {
            sponsors: sponsors,
            articles: articles,
        },
    };
};

export interface SponsorPageProps {
    sponsors: SponsorData[];
    articles: Article[];
}

const Sponsor: FC<SponsorPageProps> = ({ sponsors, articles }) => {
    return (
        <>
            <MainHead
                title="Sponsors"
                description="Thanks to our generous sponsors for supporting the project."
            />

            <Navbar />

            <Intro />
            <Wrapper>
                <Main className="m-b-30">
                    <SponsorSidebar articles={articles} />
                    <Panel>
                        <SponsorsList sponsors={sponsors} />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorMessage />
            <Footer />
        </>
    );
};

export default Sponsor;
