import type { GetServerSideProps } from 'next';
import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import {
    Intro,
    HomepageSidebar,
    MostViewedTools,
    PopularToolsByLanguage,
} from '@components/homepage';
import { type Tool } from '@components/tools';
import { FC } from 'react';

export const getServerSideProps: GetServerSideProps<HompageProps> = async ({
    req,
}) => {
    // Get BaseUrl from context request
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = req ? `${protocol}://${req.headers.host}` : '';

    // Fetch data from API
    const res = await fetch(`${baseUrl}/api/mostViewed`);
    const mostViewedTools = await res.json();

    if (!mostViewedTools) {
        return { props: { mostViewedTools: [] } };
    }

    // Pass data to the page via props
    return { props: { mostViewedTools } };
};

export interface HompageProps {
    mostViewedTools: Tool[];
}

const HomePage: FC<HompageProps> = ({ mostViewedTools }) => {
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
                    <HomepageSidebar />
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
