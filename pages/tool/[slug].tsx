import { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { MainHead, Footer, Navbar, SponsorBanner } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { PanelHeader } from '@components/elements';
import LinkButton from '@components/elements/LinkButton/LinkButton';
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
import { ToolsRepository } from '@lib/repositories';
import { getComparisonCandidatesForTool } from '@lib/comparisons/comparison-helpers';
import styles from './ToolPage.module.css';

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

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug?.toString();
    if (!slug || slug === '') {
        return {
            notFound: true,
        };
    }

    const toolsRepo = ToolsRepository.getInstance();

    const apiTool = toolsRepo.getById(slug);
    if (!apiTool) {
        console.error(`Tool ${slug} not found. Cannot build slug page.`);
        return {
            notFound: true,
        };
    }

    const sponsors = getSponsors();
    const previews = await getArticlesPreviews();
    const icon = toolsRepo.getIcon(slug);

    // Votes are now included in static tools.json data
    const tool = {
        ...apiTool,
        id: slug,
        icon: icon,
    };

    // Get all tools for alternatives
    const allTools = toolsRepo.getAllAsArray();
    let alternatives: Tool[] = [];
    const allAlternatives = allTools.filter((t) => t.id !== slug);

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

    const comparisons = getComparisonCandidatesForTool(allTools, slug, {
        maxPairsPerTool: 8,
        requireSharedCategory: true,
        requireSharedLanguage: true,
        excludeDeprecated: true,
    }).map(({ left, right, slug: comparisonSlug }) => {
        const other = left.id === slug ? right : left;
        return {
            slug: comparisonSlug,
            toolId: other.id,
            toolName: other.name,
        };
    });

    return {
        props: {
            tool,
            alternatives,
            comparisons,
            sponsors,
            previews,
            screenshots: (await getScreenshots(slug)) || null,
        },
    };
};

export interface ToolProps {
    tool: Tool;
    alternatives: Tool[];
    comparisons: { slug: string; toolId: string; toolName: string }[];
    sponsors: SponsorData[];
    previews: ArticlePreview[];
    screenshots: { path: string; url: string }[];
    starHistory: StarHistory;
}

const ToolPage: FC<ToolProps> = ({
    tool,
    alternatives,
    comparisons,
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
                        {comparisons.length > 0 && (
                            <div className={styles.section}>
                                <div className={styles.header}>
                                    <PanelHeader
                                        level={3}
                                        text="Popular Comparisons"
                                    />
                                    <span className={styles.subtitle}>
                                        Quick side-by-side picks for the same
                                        language and category.
                                    </span>
                                </div>
                                <div className={styles.list}>
                                    {comparisons.map((comparison) => (
                                        <div
                                            key={comparison.slug}
                                            className={styles.listItem}>
                                            <div>
                                                <div
                                                    className={
                                                        styles.listItemTitle
                                                    }>
                                                    <Link
                                                        href={`/compare/${comparison.slug}`}>
                                                        {tool.name} vs{' '}
                                                        {comparison.toolName}
                                                    </Link>
                                                </div>
                                                <div
                                                    className={
                                                        styles.listItemMeta
                                                    }>
                                                    Side-by-side comparison
                                                    built from current tool
                                                    data.
                                                </div>
                                            </div>
                                            <div className={styles.ctaRow}>
                                                <LinkButton
                                                    label="Compare"
                                                    href={`/compare/${comparison.slug}`}
                                                    type="secondary"
                                                />
                                                <Link
                                                    href={`/tool/${comparison.toolId}`}
                                                    className={
                                                        styles.listItemMeta
                                                    }>
                                                    {comparison.toolName}
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
