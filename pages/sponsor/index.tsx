import { FC } from 'react';
import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import { MainHead, Footer, Navbar } from '@components/core';
import { Card, Main, Panel, Sidebar, Wrapper } from '@components/layout';
import { Intro } from '@components/sponsors';
import { BlogPreview } from '@components/blog';
import { Newsletter } from '@components/elements';
import { sponsors } from 'utils-api/sponsors';
import { fetchArticles } from '@components/blog/queries/articles';
import { Article } from 'utils/types';

export const getServerSideProps: GetServerSideProps = async () => {
    // // Create a new QueryClient instance for each page request.
    // // This ensures that data is not shared between users and requests.
    // const queryClient = new QueryClient(QUERY_CLIENT_DEFAULT_OPTIONS);

    const articles = await fetchArticles();
    return {
        props: {
            articles: articles,
        },
    };
};

export interface SponsorPageProps {
    articles: Article[];
}

const Sponsor: FC<SponsorPageProps> = ({ articles }) => {
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
                                            src={sponsor.logo}
                                            alt={sponsor.name}
                                            width={sponsor.width}
                                            height={sponsor.height}
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
