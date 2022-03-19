import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { LanguageCard, FilterSidebar, ToolsList } from '@components/tools';
import { GetServerSideProps } from 'next';

import languages from '../../data/languages.json';
import { Tool } from '@components/tools/types';
import { FC } from 'react';
import { APIPaths, getApiURLFromContext } from 'utils/api';

export const getServerSideProps: GetServerSideProps<ToolPageProps> = async (
    ctx,
) => {
    const apiURL = getApiURLFromContext(ctx, APIPaths.TOOLS);
    const res = await fetch(apiURL);
    const tools = await res.json();

    if (tools.error) {
        return {
            notFound: true,
        };
    }

    return { props: { tools } };
};

export interface ToolPageProps {
    tools: Tool[];
}

const ToolsPage: FC<ToolPageProps> = ({ tools }) => {
    // TODO: Redirect 404
    if (!tools) {
        return null;
    }
    const title = 'Analysis Tools';
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <FilterSidebar />
                    <Panel>
                        {/* <LanguageCard language={languages[0]} /> */}
                        <ToolsList
                            heading={`Static analysis tools`}
                            tools={tools}
                        />
                        {/* 
                        <ToolsList
                            heading={`Multi-language static analysis tools`}
                            tools={[]}
                        /> */}
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorCard />
            <Footer />
        </>
    );
};

export default ToolsPage;
