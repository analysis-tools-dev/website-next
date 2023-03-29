import { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorBanner } from '@components/core';
import { Main, Panel, Sidebar, Wrapper } from '@components/layout';
import { LanguageCard, AlternativeToolsList, Tool } from '@components/tools';
import { SearchProvider } from 'context/SearchProvider';
import { ArticlePreview, LanguageData, SponsorData } from 'utils/types';
import { getArticlesPreviews } from 'utils-api/blog';
import { getLanguageData, getSimilarTags, getTags } from 'utils-api/tags';
import { filterByTags } from 'utils-api/filters';
import { BlogPreview } from '@components/blog';
import { Newsletter } from '@components/elements';
import { getSponsors } from 'utils-api/sponsors';
import { getToolsWithVotes } from 'utils-api/toolsWithVotes';
import { RelatedTagsList } from '@components/tools/listPage/RelatedTagsList';

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
    // Call an external API endpoint to get tools
    const data = await getTags('all');

    if (!data) {
        return { paths: [], fallback: false };
    }

    // Get the paths we want to pre-render based on the tags API response
    const paths = data.map((tag) => {
        return {
            params: { slug: tag.value },
        };
    });

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug?.toString();
    if (!slug || slug === '') {
        return {
            notFound: true,
        };
    }

    const tagData = await getLanguageData(slug);
    const tools = await getToolsWithVotes();
    const previews = await getArticlesPreviews();
    const sponsors = getSponsors();

    const relatedTags = getSimilarTags(slug);

    const filteredTools = filterByTags(tools, slug);

    return {
        props: {
            slug,
            tag: tagData,
            tools: filteredTools,
            previews,
            sponsors,
            relatedTags,
        },
    };
};

export interface TagProps {
    slug: string;
    tag: LanguageData;
    tools: Tool[];
    previews: ArticlePreview[];
    sponsors: SponsorData[];
    relatedTags: string[];
}

const TagPage: FC<TagProps> = ({
    slug,
    tag,
    tools,
    previews,
    sponsors,
    relatedTags,
}) => {
    // TODO: We should use the `tag.name` here, but it is undefined for some reason
    // Capitalize the first letter of the tag
    const tagName = slug.charAt(0).toUpperCase() + slug.slice(1);

    let title = `${tagName} Static Analysis Tools, Linters, And Code Formatters | Analysis Tools`;

    if (tools.length > 2) {
        // Prefix the title with the number of tools
        title = `${tools.length} ${title}`;
    }

    const description =
        'Find tools that help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';

    return (
        <SearchProvider>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <Sidebar className="topSticky">
                        <BlogPreview previews={previews} />
                        <Newsletter />
                    </Sidebar>
                    <Panel>
                        <LanguageCard tag={slug} tagData={tag} />
                        {/* We should use the tag.name instead,
                        but it is undefined */}
                        <AlternativeToolsList
                            listTitle={`${tagName} Tools`}
                            tools={tools}
                        />
                        {relatedTags.length > 0 && (
                            <RelatedTagsList tags={relatedTags} />
                        )}
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorBanner sponsors={sponsors} />
            <Footer />
        </SearchProvider>
    );
};

export default TagPage;
