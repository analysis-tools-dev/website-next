import Head from 'next/head';
import { FC } from 'react';

export interface MainHeadProps {
    title: string;
    description: string;
}

const MainHead: FC<MainHeadProps> = ({ title, description }) => {
    const canonicalURL = '/';

    return (
        <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />

            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />

            <meta property="og:title" content={title} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalURL} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={'/assets/images/social.png'} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalURL} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta
                property="twitter:image"
                content={'/assets/images/social.png'}
            />
        </Head>
    );
};

export default MainHead;
