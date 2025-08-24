import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import {
    HydrationBoundary,
    QueryClient,
    QueryClientProvider,
    type DehydratedState,
} from '@tanstack/react-query';
import { QUERY_CLIENT_DEFAULT_OPTIONS } from 'utils/constants';
import '../styles/globals.css';

const MyApp: React.FC<AppProps<{ dehydratedState: DehydratedState }>> = ({
    Component,
    pageProps,
}) => {
    const [queryClient] = React.useState(
        () => new QueryClient(QUERY_CLIENT_DEFAULT_OPTIONS),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
            </Head>
            <HydrationBoundary state={pageProps.dehydratedState}>
                <Component {...pageProps} />
            </HydrationBoundary>
        </QueryClientProvider>
    );
};

export default MyApp;
