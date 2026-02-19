import { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorBanner } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import {
    AlternativeToolsList,
    Tool,
    ToolInfoCard,
    ToolInfoSidebar,
} from '@components/tools';

import { getScreenshots } from 'utils-api/screenshot';
import { ArticlePreview, SponsorData, StarHistory } from 'utils/types';
import { containsArray } from 'utils/arrays';
import { getArticlesPreviews } from 'utils-api/blog';
import { getSponsors } from 'utils-api/sponsors';
import { ToolGallery } from '@components/tools/toolPage/ToolGallery';
import { Comments } from '@components/core/Comments';
import { calculateUpvotePercentage } from 'utils/votes';
import { ToolsRepository, VotesRepository } from '@lib/repositories';

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
    const toolsRepo = ToolsRepository.getInstance();
    const toolIds = toolsRepo.getAllIds();

    if (toolIds.length === 0) {
        return { paths: [], fallback: false };
    }

    const paths = toolIds.map((id) => ({
        params: { slug: id },
    }));

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

    const toolsRepo = ToolsRepository.getInstance();
    const votesRepo = VotesRepository.getInstance();

    const apiTool = toolsRepo.getById(slug);
    if (!apiTool) {
        console.error(`Tool ${slug} not found. Cannot build slug page.`);
        return {
            notFound: true,
        };
    }

    const sponsors = getSponsors();
    const votes = await votesRepo.fetchAll();
    const previews = await getArticlesPreviews();
    const icon = toolsRepo.getIcon(slug);

    // Calculate the upvote percentage based on the votes
    const voteKey = `toolsyaml${slug}`;
    const voteData = votes ? votes[voteKey] : null;
    const upvotePercentage = calculateUpvotePercentage(
        voteData?.upVotes,
        voteData?.downVotes,
    );

    const tool = {
        ...apiTool,
        upvotePercentage,
        id: slug,
        icon: icon,
    };

    // Get all tools with votes for alternatives
    const allToolsWithVotes = toolsRepo.withVotesAsArray(votes);
    let alternatives: Tool[] = [];
    const allAlternatives = allToolsWithVotes.filter((t) => t.id !== slug);

    // Show only tools with the same type, languages, and categories
    alternatives = allAlternatives.filter((alt) => {
        return (
            containsArray(alt.types, tool.types || []) &&
            containsArray(alt.languages, tool.languages || []) &&
            containsArray(alt.categories, tool.categories || [])
        );
    });

    // If the list is empty, show tools with most matched languages
    if (alternatives.length === 0) {
        alternatives = allAlternatives
            .sort((a, b) => {
                const aMatches =
                    a.languages?.filter((lang) =>
                        tool.languages?.includes(lang),
                    ).length || 0;
                const bMatches =
                    b.languages?.filter((lang) =>
                        tool.languages?.includes(lang),
                    ).length || 0;
                return bMatches - aMatches;
            })
            .filter((alt) => {
                const matches =
                    alt.languages?.filter((lang) =>
                        tool.languages?.includes(lang),
                    ).length || 0;
                return matches >= 5;
            });
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

    if (alternatives.length < 2) {
        description += ` Rating And Alternatives`;
    } else if (alternatives.length === 2) {
        description += ` And Two Alternatives`;
    } else {
        description += ` Rating And ${alternatives.length} Alternatives`;
    }

    const title = `${description} | Analysis Tools`;

    return (
        <>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <ToolInfoSidebar tool={tool} previews={previews} />
                    <Panel>
                        <ToolInfoCard tool={tool} />
                        {screenshots && screenshots.length > 0 && (
                            <ToolGallery
                                tool={tool}
                                screenshots={screenshots}
                            />
                        )}

                        <Comments />
                        <AlternativeToolsList
                            listTitle={`Alternatives for ${tool.name}`}
                            currentTool={tool}
                            tools={alternatives}
                        />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorBanner sponsors={sponsors} />
            <Footer />
        </>
    );
};

export default ToolPage;
