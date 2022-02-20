import type { NextPage } from 'next';
import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { Intro, HomepageSidebar } from '@components/homepage';
import { MostViewedTools, PopularToolsByLanguage } from '@components/tools';

const Home: NextPage = () => {
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
                        <MostViewedTools />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorCard />
            <Footer />
        </>
    );
};

export default Home;
