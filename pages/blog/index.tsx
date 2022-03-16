import { FC } from 'react';
import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { Heading } from '@components/typography';

// TODO: getStaticProps for blog articles
export interface BlogPageProps {
    posts?: [];
}

const BlogPage: FC<BlogPageProps> = ({ posts = [] }) => {
    const title = 'Analysis Tools';
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    {/* <FilterSidebar /> */}
                    <Panel>
                        <Heading level={1}>Blog Page</Heading>
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorCard />
            <Footer />
        </>
    );
};

export default BlogPage;
