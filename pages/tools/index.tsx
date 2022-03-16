import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { LanguageCard, FilterSidebar, ToolsList } from '@components/tools';
import { GetServerSideProps } from 'next';

import languages from '../../data/languages.json';
import { Tool } from '@components/tools/types';
import { FC } from 'react';
import { type ParsedUrlQuery } from 'querystring';
import { objectToQueryString } from 'utils';

const getApiUrl = (baseUrl: string, query: ParsedUrlQuery) => {
    let url = `${baseUrl}/api/tools`;
    if (!query) {
        return url;
    }
    const queryString = objectToQueryString(query);
    if (queryString) {
        url += `?${queryString}`;
    }

    return url;
};

export const getServerSideProps: GetServerSideProps<ToolPageProps> = async ({
    req,
    query,
}) => {
    // Get BaseUrl from context request (localhost or host url)
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = req ? `${protocol}://${req.headers.host}` : '';

    const apiURL = getApiUrl(baseUrl, query);
    const res = await fetch(apiURL);
    const tools = await res.json();

    if (!tools) {
        return { props: { tools: [] } };
    }

    return { props: { tools } };
};

export interface ToolPageProps {
    tools: Tool[];
}

const ToolsPage: FC<ToolPageProps> = ({ tools }) => {
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
