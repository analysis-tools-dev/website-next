import { FC } from 'react';
import type { GetStaticProps } from 'next';
import Image from 'next/image';
import { MainHead, Footer, Navbar } from '@components/core';
import { Card, Main, Panel, Sidebar, Wrapper } from '@components/layout';
import { Intro } from '@components/sponsors';
import { BlogPreview } from '@components/blog';
import { LinkButton, Newsletter } from '@components/elements';
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
                    <Sidebar className="bottomSticky">
                        <BlogPreview articles={articles} />
                        <Newsletter />
                    </Sidebar>
                    <Panel>
                        <div>
                            {sponsors.map((sponsor) => (
                                <Card key={sponsor.name} className="m-b-30">
                                    <a
                                        href={sponsor.url}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        <Image
                                            src={sponsor.logo.src}
                                            alt={sponsor.name}
                                            width={sponsor.logo.width}
                                            height={sponsor.logo.height}
                                        />
                                    </a>
                                    <div className="mt-4 text-center">
                                        <h3 className="text-lg font-semibold">
                                            {sponsor.name}
                                        </h3>
                                        <p className="text-gray-500">
                                            {sponsor.description}
                                        </p>
                                    </div>
                                    <div className="flex ">
                                        <LinkButton
                                            label={sponsor.tool}
                                            href={`/tool/${sponsor.tool}`}
                                            newTab={false}
                                            className="m-t-30"
                                        />
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <a
                            href="https://www.freepik.com/free-vector/holiday-gift-wrapping-packing-service-isometric-web-banner-landing-page_4758639.htm"
                            target="_blank"
                            rel="noopener noreferrer">
                            <span>Sponsor image by vectorpuch on Freepik</span>
                        </a>
                    </Panel>
                </Main>
            </Wrapper>
            <Footer />
        </>
    );
};

export default Sponsor;
