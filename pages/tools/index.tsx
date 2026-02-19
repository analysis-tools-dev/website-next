import { FC } from 'react';
import { GetStaticProps } from 'next';

import { Footer, MainHead, Navbar, SponsorBanner } from '@components/core';
import { Main, Wrapper } from '@components/layout';
import { StaticListPageComponent } from '@components/tools/listPage/StaticListPageComponent';
import { ToolsProvider } from 'context/ToolsProvider';
import { ArticlePreview, SponsorData } from 'utils/types';
import { getSponsors } from 'utils-api/sponsors';
import { getArticlesPreviews } from 'utils-api/blog';
import { LanguageFilterOption } from '@components/tools/listPage/ToolsSidebar/FilterCard/LanguageFilterCard';
import { FilterOption } from '@components/tools/listPage/ToolsSidebar/FilterCard/FilterCard';
import { Tool } from '@components/tools/types';
import {
    ToolsRepository,
    TagsRepository,
    VotesRepository,
} from '@lib/repositories';

export const getStaticProps: GetStaticProps = async () => {
    const sponsors = getSponsors();
    const articles = await getArticlesPreviews();

    // Get tools with votes
    const toolsRepo = ToolsRepository.getInstance();
    const votesRepo = VotesRepository.getInstance();
    const tagsRepo = TagsRepository.getInstance();

    const votes = await votesRepo.fetchAll();
    const tools = toolsRepo.withVotesAsArray(votes);

    // Sort tools by votes initially
    const sortedTools = [...tools].sort(
        (a, b) => (b.votes || 0) - (a.votes || 0),
    );

    // Get languages and others for filter options
    const languageTags = tagsRepo.getAll('languages');
    const otherTags = tagsRepo.getAll('other');

    const languages: LanguageFilterOption[] = languageTags.map((tag) => ({
        value: tag.value,
        name: tag.name,
        tag_type: tag.tag_type,
    }));

    const others: FilterOption[] = otherTags.map((tag) => ({
        value: tag.value,
        name: tag.name,
        tag_type: tag.tag_type,
    }));

    return {
        props: {
            sponsors,
            languages,
            others,
            articles,
            tools: sortedTools,
        },
        // Revalidate every hour for ISR
        revalidate: 3600,
    };
};

export interface ToolsProps {
    sponsors: SponsorData[];
    languages: LanguageFilterOption[];
    others: FilterOption[];
    articles: ArticlePreview[];
    tools: Tool[];
}

const ToolsPage: FC<ToolsProps> = ({
    sponsors,
    languages,
    others,
    articles,
    tools,
}) => {
    const title =
        'Compare 700+ Linters, Static Analysis Tools And Code Formatters';

    const description =
        'Find the best SAST tool for your project. All CLI tools and services for JavaScript, Python, Java, C, PHP, Ruby, and more.';

    return (
        <>
            <MainHead title={title} description={description} />
            <ToolsProvider initialTools={tools}>
                <Navbar />
                <Wrapper className="m-t-20 m-b-30 ">
                    <Main>
                        <StaticListPageComponent
                            languages={languages}
                            others={others}
                            articles={articles}
                        />
                    </Main>
                </Wrapper>
                <SponsorBanner sponsors={sponsors} />
                <Footer />
            </ToolsProvider>
        </>
    );
};

export default ToolsPage;
