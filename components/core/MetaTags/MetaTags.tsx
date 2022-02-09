import Head from 'next/head';
import { FC } from 'react';

export interface MetaTagsProps {
    title: string;
    description: string;
    image?: string;
}

const MetaTags: FC<MetaTagsProps> = ({ title, description, image }) => {
    const canonicalURL = '/';

    return (
        <Head>
            {/* Primary Meta Tags */}
            <meta name="title" content={title} />
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalURL} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta
                property="og:image"
                content={image ? image : 'https://astro.build/social.jpg?v=1'}
            />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalURL} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta
                property="twitter:image"
                content={image ? image : 'https://astro.build/social.jpg?v=1'}
            />
        </Head>
    );
};

export default MetaTags;
