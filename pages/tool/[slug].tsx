import { FC } from 'react';
import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { GetServerSideProps } from 'next';
import { APIPaths, getApiURLFromContext } from 'utils/api';
import { Tool, ToolInfoCard, ToolInfoSidebar } from '@components/tools';
import { PanelHeader } from '@components/elements';

interface ToolPageProps {
    tool: Tool;
}

// TODO: Add fallback pages instead of 404, maybe says tool not found and asks user if they would like to add it?
export const getServerSideProps: GetServerSideProps<ToolPageProps> = async (
    ctx,
) => {
    const { slug } = ctx.query;
    if (!slug || slug === '') {
        return {
            notFound: true,
        };
    }

    const toolPath = `${APIPaths.TOOL}/${slug.toString()}`;
    const apiURL = getApiURLFromContext(ctx, toolPath);
    const res = await fetch(apiURL);
    const tool = await res.json();

    if (!tool) {
        return { props: { tool: {} } };
    }

    return { props: { tool } };
};

const ToolPage: FC<ToolPageProps> = ({ tool }) => {
    const title = 'Analysis Tools';
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <ToolInfoSidebar tool={tool} />
                    <Panel>
                        <ToolInfoCard tool={tool} />

                        <PanelHeader
                            level={3}
                            text={`${tool.name} alternative tools`}></PanelHeader>
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorCard />
            <Footer />
        </>
    );
};

export default ToolPage;
