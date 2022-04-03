import type { GetServerSideProps } from 'next';
import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Sidebar, Wrapper } from '@components/layout';
import {
    Intro,
    MostViewedTools,
    PopularToolsByLanguage,
} from '@components/homepage';
import { type Tool } from '@components/tools';
import { FC } from 'react';
import { type Article } from 'utils/types';
import { BlogPreview } from '@components/blog';
import { Newsletter } from '@components/elements';

export const getServerSideProps: GetServerSideProps<HompageProps> = async ({
    req,
}) => {
    // Get BaseUrl from context request
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = req ? `${protocol}://${req.headers.host}` : '';

    // Fetch tool data from API
    const toolRes = await fetch(`${baseUrl}/api/mostViewed`);
    const mostViewedTools = await toolRes.json();

    // Fetch article data from API
    const articleRes = await fetch(`${baseUrl}/api/articles`);
    const articles = await articleRes.json();

    if (mostViewedTools.error || articles.error) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            mostViewedTools,
            articles,
        },
    };
};

export interface HompageProps {
    mostViewedTools: Tool[];
    articles: Article[];
}

const HomePage: FC<HompageProps> = ({ mostViewedTools, articles }) => {
    // TODO: Handle errors
    const title = 'Analysis Tools';
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <>
            <MainHead title={title} description={description} />

            <Navbar />

            <Intro />
            <Wrapper>
                <Main className="m-b-30">
                    <Sidebar className="bottomSticky">
                        <BlogPreview articles={articles} />
                        <Newsletter />
                    </Sidebar>
                    <Panel>
                        <PopularToolsByLanguage />

                        <MostViewedTools mostViewedTools={mostViewedTools} />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorCard />
            <Footer />
        </>
    );
};

export default HomePage;
