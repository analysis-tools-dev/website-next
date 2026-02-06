import { FC, useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorBanner, FAQ } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { LanguageCard, AlternativeToolsList } from '@components/tools';
import { SearchProvider } from 'context/SearchProvider';
import {
    AffiliatesData,
    ArticlePreview,
    Faq,
    LanguageData,
    SponsorData,
} from 'utils/types';
import { getArticlesPreviews } from 'utils-api/blog';
import { getSponsors } from 'utils-api/sponsors';
import { RelatedTagsList } from '@components/tools/listPage/RelatedTagsList';
import { LanguageFilterOption } from '@components/tools/listPage/ToolsSidebar/FilterCard/LanguageFilterCard';
import { Tool } from '@components/tools';
import { TagsSidebar } from '@components/tags';
import { getRandomAffiliate } from 'utils-api/affiliates';
import {
    TagsRepository,
    ToolsRepository,
    ToolsFilter,
    VotesRepository,
} from '@lib/repositories';

export const getStaticPaths: GetStaticPaths = async () => {
    const tagsRepo = TagsRepository.getInstance();
    const tags = tagsRepo.getAll('all');

    if (tags.length === 0) {
        return { paths: [], fallback: false };
    }

    const paths = tags.map((tag) => ({
        params: { slug: tag.value },
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

    const tagsRepo = TagsRepository.getInstance();
    const toolsRepo = ToolsRepository.getInstance();
    const votesRepo = VotesRepository.getInstance();

    const tagData = tagsRepo.getDescription(slug);

    let tagName = slug.charAt(0).toUpperCase() + slug.slice(1);
    if ('name' in tagData && tagData.name) {
        tagName = tagData.name;
    }

    const votes = await votesRepo.fetchAll();
    const toolsWithVotes = toolsRepo.withVotes(votes);
    const filter = ToolsFilter.from(toolsWithVotes);

    const previews = await getArticlesPreviews();
    const sponsors = getSponsors();
    const languages = tagsRepo.getAll('languages');
    const affiliate = getRandomAffiliate([slug]);

    const relatedTags = tagsRepo.getRelated(slug);
    const filteredTools = filter.byTag(slug);

    // best tools by percent upvoted (single language only)
    const bestTools = filteredTools
        .sort((a, b) => b.votes - a.votes)
        .map((tool) => tool.name)
        .slice(0, 5);

    // Tools with a free plan
    const freePlanTools = filteredTools
        .filter((tool) => tool.plans?.free === true)
        .map((tool) => tool.name);

    const openSourceTools = filteredTools
        .filter((tool) => tool.source)
        .sort((a, b) => b.votes - a.votes)
        .map((tool) => tool.name)
        .slice(0, 10);

    const freeForOss = filteredTools
        .filter((tool) => tool.source || tool.plans?.oss === true)
        .map((tool) => tool.name);

    const faq = [
        {
            question: `What are ${tagName ? tagName : tagData} tools?`,
            answer: tagData.description,
        },
    ];

    if (bestTools.length > 0) {
        faq.push({
            question: `What are the best ${tagName} static analysis tools and linters?`,
            answer: `The most popular ${tagName} tools ranked by user votes are: ${bestTools.join(
                ', ',
            )}.`,
        });
    }

    if (freePlanTools.length > 0) {
        faq.push({
            question: `Which ${tagName} tools are free to use?`,
            answer: `Tools with a free plan include ${freePlanTools.join(
                ', ',
            )}. On top of that, there are also a number of open source like ${openSourceTools.join(
                ', ',
            )}.`,
        });
    }

    if (freeForOss.length > 0) {
        faq.push({
            question: `Which ${tagName} services are free for open source projects?`,
            answer: `Commercial services with a free plan for open source include ${freeForOss.join(
                ', ',
            )}.`,
        });
    }

    return {
        props: {
            slug,
            tagName,
            tag: tagData,
            tools: filteredTools,
            languages,
            previews,
            sponsors,
            affiliate,
            relatedTags,
            faq,
        },
    };
};

export interface TagProps {
    slug: string;
    tagName: string;
    tag: LanguageData;
    tools: Tool[];
    languages: LanguageFilterOption[];
    previews: ArticlePreview[];
    sponsors: SponsorData[];
    affiliate: AffiliatesData;
    relatedTags: string[];
    faq: Faq[];
}

const TagPage: FC<TagProps> = ({
    slug,
    tagName,
    tag,
    tools,
    languages,
    previews,
    sponsors,
    affiliate,
    relatedTags,
    faq,
}) => {
    let title = `${tagName} Static Analysis Tools, Linters, And Code Formatters | Analysis Tools`;

    if (tools.length > 2) {
        // Prefix the title with the number of tools
        title = `${tools.length} ${title}`;
    }

    const description =
        'Find tools that help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    // Only show the first blog post preview
    previews = previews.slice(0, 1);

    // filter languages and others by related tags
    languages = languages.filter((language) =>
        relatedTags.includes(language.value),
    );

    const [filteredTools, setFilteredTools] = useState(tools);

    const [filters, setFilters] = useState({
        categories: [],
        types: [],
        licenses: [],
        pricing: [],
    });

    // Filter the list of tools based on the current filters
    useEffect(() => {
        const filtered = tools.filter((tool) => {
            // Check if the tool matches all the selected filter options
            return (
                // Allow tools with any of the selected filters
                // If no filters  are selected, allow all tools
                (filters.categories.length === 0 ||
                    filters.categories.some((category) =>
                        tool.categories.includes(category),
                    )) &&
                (filters.types.length === 0 ||
                    filters.types.some((type) => tool.types.includes(type))) &&
                (filters.licenses.length === 0 ||
                    filters.licenses.some((license) =>
                        tool.licenses.includes(license),
                    )) &&
                (filters.pricing.length === 0 ||
                    filters.pricing.some((pricing) => {
                        if (pricing === 'free') {
                            return tool.plans?.free === true;
                        } else if (pricing === 'oss') {
                            return tool.plans?.oss !== true || tool.source;
                        } else if (pricing === 'plans') {
                            return tool.pricing !== null;
                        }
                    }))
            );
        });
        setFilteredTools(filtered);
    }, [tools, filters]);

    const onFilterChange = (
        filter: string,
        value: string,
        checked: boolean,
    ) => {
        // update the filters
        // TODO: Remove type ignore
        setFilters((prev) => {
            const newFilters = { ...prev };
            if (checked) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                newFilters[filter].push(value);
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                newFilters[filter] = newFilters[filter].filter(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    (item) => item !== value,
                );
            }
            return newFilters;
        });
    };

    return (
        <>
            <SearchProvider>
                <MainHead title={title} description={description} />

                <Navbar />
                <Wrapper className="m-t-20 m-b-30 ">
                    <Main>
                        <TagsSidebar
                            previews={previews}
                            relatedLanguages={languages}
                            onFilterChange={onFilterChange}
                        />
                        <Panel>
                            <LanguageCard
                                tools={tools}
                                tag={slug}
                                tagData={tag}
                            />
                            {/* We should use the tag.name instead,
                        but it is undefined */}
                            <AlternativeToolsList
                                listTitle={`${tagName} Tools`}
                                tools={filteredTools}
                                affiliate={affiliate}
                            />
                            <FAQ faq={faq} />
                            {relatedTags.length > 0 && (
                                <RelatedTagsList tags={relatedTags} />
                            )}
                        </Panel>
                    </Main>
                </Wrapper>

                <SponsorBanner sponsors={sponsors} />
                <Footer />
            </SearchProvider>
        </>
    );
};

export default TagPage;
