import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Footer, MetaTags, Navbar, SponsorCard } from '@components/core';
import { Intro } from '@components/homepage';
import { Wrapper, Main, Panel, Card } from '@components/layout';
import { Heading } from '@components/typography';
import { HomepageSidebar } from '@components/homepage';
import { PanelHeader } from '@components/elements';

const Home: NextPage = () => {
    const title = 'Analysis Tools';
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />

                <title>{title}</title>
                <meta name="title" content={title} />
                <meta name="description" content={description} />
                <MetaTags title={title} description={description} />
            </Head>

            <Navbar />

            <Intro />
            <Wrapper>
                <Main>
                    <HomepageSidebar />
                    <Panel>
                        <PanelHeader
                            level={2}
                            text="Popular Static Analysis Tools by Language">
                            <Link href="/">Show all (63)</Link>
                        </PanelHeader>
                        <Card>
                            <Heading level={1}>Content Panel</Heading>
                        </Card>
                    </Panel>
                </Main>
            </Wrapper>
            <SponsorCard />
            <Footer />
        </>
    );
};

export default Home;
