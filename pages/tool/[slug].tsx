import { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorBanner } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { getTool } from 'utils-api/tools';
import {
    AlternateToolsList,
    Tool,
    ToolInfoCard,
    ToolInfoSidebar,
} from '@components/tools';
import { SearchProvider } from 'context/SearchProvider';
import { getScreenshots } from 'utils-api/screenshot';
import { getTools } from 'utils-api/tools';
import { Article, SponsorData, StarHistory } from 'utils/types';
import { containsArray } from 'utils/arrays';
import { getVotes } from 'utils-api/votes';
import { getArticles } from 'utils-api/blog';
import { getSponsors } from 'utils-api/sponsors';

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
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug?.toString();
    if (!slug || slug === '') {
        return {
            notFound: true,
        };
    }

    const sponsors = getSponsors();
    const votes = await getVotes();
    const apiTool = await getTool(slug);
    const articles = await getArticles();

    if (!apiTool) {
        return {
            notFound: true,
        };
    }

    const tool = {
        ...apiTool,
        id: slug,
    };

    const alternativeTools = await getTools();
    let alternatives: Tool[] = [];
    if (alternativeTools) {
        alternatives = Object.entries(alternativeTools).reduce(
            (acc, [id, tool]) => {
                // if key is not equal to slug
                if (id !== slug) {
                    // push value to acc
                    // add id and votes to value
                    const voteKey = `toolsyaml${id.toString()}`;

                    // check if we have votes for this tool
                    // otherwise set to 0
                    const voteData = votes
                        ? votes[voteKey]
                            ? votes[voteKey].sum
                            : 0
                        : 0;

                    acc.push({ id, ...tool, votes: voteData });
                }
                return acc;
            },
            [] as Tool[],
        );

        // if in currentTool view, show only tools with the same type
        if (tool) {
            alternatives = alternatives.filter((alt) => {
                return (
                    containsArray(alt.types, tool.types || []) &&
                    containsArray(alt.languages, tool.languages || []) &&
                    containsArray(alt.categories, tool.categories || [])
                );
            });
        }
    }

    return {
        props: {
            tool,
            alternatives,
            sponsors,
            articles,
            screenshots: (await getScreenshots(slug)) || null,
        },
    };
};

export interface ToolProps {
    tool: Tool;
    alternatives: Tool[];
    sponsors: SponsorData[];
    articles: Article[];
    screenshots: { path: string; url: string }[];
    starHistory: StarHistory;
}

const ToolPage: FC<ToolProps> = ({
    tool,
    alternatives,
    sponsors,
    articles,
    screenshots,
    starHistory,
}) => {
    const title = `${tool.name} - Analysis Tools`;
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <SearchProvider>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <ToolInfoSidebar tool={tool} articles={articles} />
                    <Panel>
                        <ToolInfoCard tool={tool} screenshots={screenshots} />
                        <AlternateToolsList tools={alternatives} />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorBanner sponsors={sponsors} />
            <Footer />
        </SearchProvider>
    );
};

export default ToolPage;
