import Head from 'next/head';
import { FC } from 'react';
import MetaTags from '../MetaTags/MetaTags';

export interface MainHeadProps {
    title: string;
    description: string;
}

const MainHead: FC<MainHeadProps> = ({ title, description }) => {
    return (
        <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />

            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <MetaTags title={title} description={description} />
        </Head>
    );
};

export default MainHead;
