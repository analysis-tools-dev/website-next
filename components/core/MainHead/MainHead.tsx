import Head from 'next/head';
import { FC } from 'react';

export interface MainHeadProps {
    title: string;
    description: string;
}

const MainHead: FC<MainHeadProps> = ({ title, description }) => {
    const canonicalURL = '/';

    // Use absolute URL for social image to avoid issues with some social networks
    // Note that the domain name is hardcoded here, because we don't have access to the
    // request object from the getStaticProps function and we don't want to pass it as a prop
    // See https://ogp.me/#url and https://github.com/jitsi/jitsi-meet/issues/6031
    const socialImage = 'https://analysis-tools.dev/assets/images/social.png';

    const inlineCSS = `
        :root {
            --font-fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Liberation Sans', 'Ubuntu', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
            --font-body: 'Roboto', var(--font-fallback);
            --font-body-bold: 'Roboto-Bold', var(--font-body);
        }
        body {
            font-family: var(--font-body);
            letter-spacing: .5px;
        }
        .bold {
            font-family: var(--font-body-bold);
        }
    `;

    return (
        <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width" />

            <title>{title}</title>

            {/* Inline Critical CSS */}
            <style dangerouslySetInnerHTML={{ __html: inlineCSS }} />

            <meta name="title" content={title} />
            <meta name="description" content={description} />

            <meta property="og:title" content={title} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalURL} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={socialImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalURL} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={socialImage} />

            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
    );
};

export default MainHead;
