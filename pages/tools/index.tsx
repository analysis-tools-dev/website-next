import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { SearchProvider } from 'context/SearchProvider';

import { Footer, Navbar, SponsorBanner } from '@components/core';
import { Main, Wrapper } from '@components/layout';
import {
    fetchLanguages,
    prefetchLanguages,
} from '@components/tools/queries/languages';
import { fetchArticles } from '@components/blog/queries/articles';
import { QUERY_CLIENT_DEFAULT_OPTIONS } from 'utils/constants';
import { Article, SponsorData } from 'utils/types';
import { prefetchTools } from '@components/tools/queries';
import { ListPageComponent } from '@components/tools';
import { getSponsors } from 'utils-api/sponsors';
import { MobileFilters } from '@components/tools/listPage';
import { fetchOthers } from '@components/tools/queries/others';
import { LanguageFilterOption } from '@components/tools/listPage/ToolsSidebar/FilterCard/LanguageFilterCard';
import { FilterOption } from '@components/tools/listPage/ToolsSidebar/FilterCard/FilterCard';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const sponsors = getSponsors();
    const articles = await fetchArticles();
    const languages = await fetchLanguages();
    const others = await fetchOthers();

    // Create a new QueryClient instance for each page request.
    // This ensures that data is not shared between users and requests.
    const queryClient = new QueryClient(QUERY_CLIENT_DEFAULT_OPTIONS);
    await prefetchLanguages(queryClient);
    await prefetchTools(queryClient, ctx.query);

    return {
        props: {
            sponsors,
            languages,
            others,
            articles,
            dehydratedState: dehydrate(queryClient),
        },
    };
};

export interface ToolsProps {
    sponsors: SponsorData[];
    languages: LanguageFilterOption[];
    others: FilterOption[];
    articles: Article[];
}

const ToolsPage: FC<ToolsProps> = ({
    sponsors,
    languages,
    others,
    articles,
}) => {
    return (
        <SearchProvider>
            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <ListPageComponent
                        languages={languages}
                        others={others}
                        articles={articles}
                    />
                </Main>
            </Wrapper>

            <SponsorBanner sponsors={sponsors} />
            <Footer />
        </SearchProvider>
    );
};

export default ToolsPage;
