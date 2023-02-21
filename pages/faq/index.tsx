import { FC } from 'react';
import type { GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SingleFAQ } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { Intro, SponsorSidebar } from '@components/sponsors';
import { Article, Faq } from 'utils/types';
import { getArticles } from 'utils-api/blog';
import { getFaq } from 'utils-api/faq';
import { Heading } from '@components/typography';
import { PanelHeader } from '@components/elements';

export const getStaticProps: GetStaticProps = async () => {
    const faq = getFaq();
    const articles = await getArticles();

    return {
        props: {
            faq,
            articles,
        },
    };
};

export interface FaqPageProps {
    faq: Faq[];
    articles: Article[];
}

const Faq: FC<FaqPageProps> = ({ faq, articles }) => {
    return (
        <>
            <MainHead
                title="FAQ | Analysis Tools"
                description="Frequently asked questions about code analysis tools and linters.
                "
            />

            <Navbar />

            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <SponsorSidebar articles={articles} />
                    <Panel>
                        <PanelHeader
                            level={1}
                            text="Frequently Asked Questions"
                        />
                        {faq.map((faq) => (
                            <SingleFAQ key={faq.question} faq={faq} />
                        ))}
                    </Panel>
                </Main>
            </Wrapper>
            <Footer />
        </>
    );
};

export default Faq;
