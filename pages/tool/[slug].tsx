import { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorBanner } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { getTool, getToolIcon } from 'utils-api/tools';
import {
    AlternativeToolsList,
    Tool,
    ToolInfoCard,
    ToolInfoSidebar,
} from '@components/tools';
import { SearchProvider } from 'context/SearchProvider';
import { getScreenshots } from 'utils-api/screenshot';
import { getAllTools } from 'utils-api/tools';
import { ArticlePreview, SponsorData, StarHistory } from 'utils/types';
import { containsArray } from 'utils/arrays';
import { getVotes } from 'utils-api/votes';
import { getArticlesPreviews } from 'utils-api/blog';
import { getSponsors } from 'utils-api/sponsors';
import { ToolGallery } from '@components/tools/toolPage/ToolGallery';
import { Comments } from '@components/core/Comments';

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
    // Call an external API endpoint to get tools
    const data = await getAllTools();

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
    const previews = await getArticlesPreviews();
    const icon = await getToolIcon(slug);

    if (!apiTool) {
        return {
            notFound: true,
        };
    }

    const tool = {
        ...apiTool,
        id: slug,
        icon: icon,
    };
    const alternativeTools = await getAllTools();
    let alternatives: Tool[] = [];
    let allAlternatives: Tool[] = [];
    if (alternativeTools) {
        allAlternatives = Object.entries(alternativeTools).reduce(
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
            alternatives = allAlternatives.filter((alt) => {
                return (
                    containsArray(alt.types, tool.types || []) &&
                    containsArray(alt.languages, tool.languages || []) &&
                    containsArray(alt.categories, tool.categories || [])
                );
            });

            // if the list is empty, show the tools with the same type and the most
            // matched languages
            if (alternatives.length === 0) {
                alternatives = allAlternatives;

                // sort the list by the number of matched languages
                alternatives.sort((a, b) => {
                    return (
                        b.languages?.filter((lang) =>
                            tool.languages?.includes(lang),
                        ).length -
                        a.languages?.filter((lang) =>
                            tool.languages?.includes(lang),
                        ).length
                    );
                });

                // take the tools with at least 5 matched languages
                alternatives = alternatives.filter((alt) => {
                    return (
                        alt.languages?.filter((lang) =>
                            tool.languages?.includes(lang),
                        ).length >= 5
                    );
                });
            }
        }
    }

    return {
        props: {
            tool,
            alternatives,
            sponsors,
            previews,
            screenshots: (await getScreenshots(slug)) || null,
        },
    };
};

export interface ToolProps {
    tool: Tool;
    alternatives: Tool[];
    sponsors: SponsorData[];
    previews: ArticlePreview[];
    screenshots: { path: string; url: string }[];
    starHistory: StarHistory;
}

const ToolPage: FC<ToolProps> = ({
    tool,
    alternatives,
    sponsors,
    previews,
    screenshots,
}) => {
    const languages = tool.languages || [];
    const capitalizedLanguages = languages.map((lang) => {
        return lang
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    });
    // If the list of languages is longer than 3, just show the first 3
    if (capitalizedLanguages.length > 3) {
        capitalizedLanguages.splice(3, capitalizedLanguages.length - 3);
    }

    let description = `${tool.name}, a ${tool.categories.join(
        '/',
    )} for ${capitalizedLanguages.join('/')} - `;

    if (alternatives.length === 0) {
        description += ` Rating And Alternatives`;
    } else if (alternatives.length === 2) {
        description += ` And Two Alternatives`;
    } else {
        description += ` Rating And ${alternatives.length} Alternatives`;
    }

    const title = `${description} | Analysis Tools`;

    return (
        <SearchProvider>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <ToolInfoSidebar tool={tool} previews={previews} />
                    <Panel>
                        <ToolInfoCard tool={tool} />
                        <ToolGallery tool={tool} screenshots={screenshots} />

                        <Comments />
                        <AlternativeToolsList
                            currentTool={tool}
                            tools={alternatives}
                        />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorBanner sponsors={sponsors} />
            <Footer />
        </SearchProvider>
    );
};

export default ToolPage;
