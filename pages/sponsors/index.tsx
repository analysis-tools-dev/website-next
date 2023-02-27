import { FC } from 'react';
import type { GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorMessage } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { Intro, SponsorSidebar, SponsorsList } from '@components/sponsors';
import { ArticlePreview, SponsorData } from 'utils/types';
import { getArticlesPreviews } from 'utils-api/blog';
import { getSponsors } from 'utils-api/sponsors';

export const getStaticProps: GetStaticProps = async () => {
    const sponsors = getSponsors();
    const previews = await getArticlesPreviews();

    return {
        props: {
            sponsors: sponsors,
            previews: previews,
        },
    };
};

export interface SponsorPageProps {
    sponsors: SponsorData[];
    previews: ArticlePreview[];
}

const Sponsor: FC<SponsorPageProps> = ({ sponsors, previews: previews }) => {
    return (
        <>
            <MainHead
                title="Sponsors | Analysis Tools"
                description="Thanks to our generous sponsors for supporting the project."
            />

            <Navbar />

            <Intro />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <SponsorSidebar previews={previews} />
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
