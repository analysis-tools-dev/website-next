import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from 'react-query';
import { MainHead, Footer, Navbar, SponsorCard } from '@components/core';
import { Main, Panel, Wrapper } from '@components/layout';
import { ToolInfoCard, ToolInfoSidebar, ToolsList } from '@components/tools';
import { prefetchArticles } from '@components/blog/queries';
import { prefetchTool, useToolQuery } from '@components/tools/queries';
import { LoadingCogs } from '@components/elements';
import { QUERY_CLIENT_DEFAULT_OPTIONS } from 'utils/constants';

// TODO: Add fallback pages instead of 404, maybe says tool not found and asks user if they would like to add it?
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { slug } = ctx.query;
    if (!slug || slug === '') {
        return {
            notFound: true,
        };
    }
    // Create a new QueryClient instance for each page request.
    // This ensures that data is not shared between users and requests.
    const queryClient = new QueryClient(QUERY_CLIENT_DEFAULT_OPTIONS);

    // TODO: Check prefetching alternateTools (would need current tool data)
    await prefetchTool(queryClient, slug.toString());
    await prefetchArticles(queryClient);

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

const ToolPage: FC = () => {
    const router = useRouter();
    const { slug } = router.query;

    const toolResult = useToolQuery(slug?.toString() || '');
    if (
        toolResult.isLoading ||
        toolResult.isFetching ||
        toolResult.isRefetching
    ) {
        return <LoadingCogs />;
    }
    if (toolResult.error || !toolResult.data) {
        return null;
    }

    const tool = toolResult.data;
    const overrideSearch = { languages: tool.languages };

    const title = `${tool.name} - Analysis Tools`;
    const description =
        'Find static code analysis tools and linters that can help you improve code quality. All tools are peer-reviewed by fellow developers to meet high standards.';
    // TODO: Update title and description to include tool

    return (
        <>
            <MainHead title={title} description={description} />

            <Navbar />
            <Wrapper className="m-t-20 m-b-30 ">
                <Main>
                    <ToolInfoSidebar tool={tool} />
                    <Panel>
                        <ToolInfoCard tool={tool} />

                        <ToolsList
                            heading={`${tool.name} alternative static tools`}
                            overrideSearch={overrideSearch}
                        />
                    </Panel>
                </Main>
            </Wrapper>

            <SponsorCard />
            <Footer />
        </>
    );
};

export default ToolPage;
