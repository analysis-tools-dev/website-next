import React from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QUERY_CLIENT_DEFAULT_OPTIONS } from 'utils/constants';

function MyApp({ Component, pageProps }: AppProps) {
    const [queryClient] = React.useState(
        () => new QueryClient(QUERY_CLIENT_DEFAULT_OPTIONS),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <>
                <Hydrate state={pageProps.dehydratedState}>
                    <Component {...pageProps} />
                </Hydrate>
            </>
        </QueryClientProvider>
    );
}

export default MyApp;
