import { FC } from 'react';
import type { GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SingleFAQ } from '@components/core';
import { Card, Main, Panel, Wrapper } from '@components/layout';
import { SponsorSidebar } from '@components/sponsors';
import { ArticlePreview, Faq } from 'utils/types';
import { getArticlesPreviews } from 'utils-api/blog';
import { getFaq } from 'utils-api/faq';
import { PanelHeader } from '@components/elements';

export const getStaticProps: GetStaticProps = async () => {
    const faq = getFaq();
    const previews = await getArticlesPreviews();

    return {
        props: {
            faq,
            previews,
        },
    };
};

export interface FaqPageProps {
    faq: Faq[];
    previews: ArticlePreview[];
}

const Faq: FC<FaqPageProps> = ({ faq, previews }) => {
    return (
        <html lang="en">
            <MainHead
                title="FAQ | Analysis Tools"
                description="Frequently asked questions about code analysis tools and linters.
                "
            />

            <Navbar />

            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <SponsorSidebar previews={previews} />
                    <Panel>
                        <Card>
                            <PanelHeader
                                level={1}
                                text="Frequently Asked Questions"
                            />
                            {faq.map((faq) => (
                                <SingleFAQ key={faq.question} faq={faq} />
                            ))}
                        </Card>
                    </Panel>
                </Main>
            </Wrapper>
            <Footer />
        </html>
    );
};

export default Faq;
