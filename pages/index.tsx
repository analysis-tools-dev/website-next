import type { NextPage } from 'next';
import { Footer, Navbar, SponsorCard } from '@components/core';
import { Intro } from '@components/homepage';
import { Wrapper, Main, Panel } from '@components/layout';
import { HomepageSidebar } from '@components/homepage';
import MainHead from '@components/core/MainHead/MainHead';
import { PopularToolsByLanguage } from '@components/tools';

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
                <Main>
                    <HomepageSidebar />
                    <Panel>
                        <PopularToolsByLanguage />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorCard />
            <Footer />
        </>
    );
};

export default Home;
