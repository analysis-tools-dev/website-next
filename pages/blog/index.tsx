import { FC } from 'react';
import { MainHead, Footer, Navbar, SponsorMessage } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { ArticleList, BlogSidebar } from '@components/blog';
import { GetStaticProps } from 'next';
import { getArticles } from 'utils-api/blog';
import { getSponsors } from 'utils-api/sponsors';
import { Article, SponsorData } from 'utils/types';
import { PanelHeader } from '@components/elements';

export const getStaticProps: GetStaticProps = async () => {
    const sponsors = getSponsors();
    const articles = await getArticles();

    return {
        props: {
            sponsors,
            articles,
        },
    };
};

export interface BlogPageProps {
    sponsors: SponsorData[];
    articles: Article[];
}

const BlogPage: FC<BlogPageProps> = ({ sponsors, articles }) => {
    const title = 'Analysis Tools';
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <BlogSidebar sponsors={sponsors} />
                    <Panel>
                        <PanelHeader level={2} text="Latest from our blog" />
                        <ArticleList articles={articles} />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorMessage />
            <Footer />
        </>
    );
};

export default BlogPage;
