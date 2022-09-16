import { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { getTool } from 'utils-api/tools';
import {
    Tool,
    ToolInfoCard,
    ToolInfoSidebar,
    ToolsList,
} from '@components/tools';
import { SearchProvider } from 'context/SearchProvider';
import { getScreenshots } from 'utils-api/screenshot';
import { getTools } from 'utils-api/tools';

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
    // Call an external API endpoint to get tools
    const data = await getTools();

    if (!data) {
        return { paths: [], fallback: false };
    }

    // Get the paths we want to pre-render based on the tools API response
    const paths = Object.keys(data).map((id) => ({
        params: { slug: id },
    }));

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false };
};

// TODO: Add fallback pages instead of 404, maybe says tool not found and ask
// user if they would like to add it?
// TODO: Check prefetching alternateTools (would need current tool data)
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug as string;
    const tool = await getTool(slug);

    return {
        props: {
            tool,
            screenshots: (await getScreenshots(slug)) || null,
        },
    };
};

export interface ToolProps {
    tool: Tool;
    screenshots: { url: string; original: string }[];
}

const ToolPage: FC<ToolProps> = ({ tool, screenshots }) => {
    const title = `${tool.name} - Analysis Tools`;
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <SearchProvider>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <ToolInfoSidebar tool={tool} />
                    <Panel>
                        <ToolInfoCard tool={tool} screenshots={screenshots} />

                        <ToolsList
                            currentTool={tool}
                            overrideLanguages={tool.languages}
                        />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorCard />
            <Footer />
        </SearchProvider>
    );
};

export default ToolPage;
