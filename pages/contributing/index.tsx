import type { GetStaticProps } from 'next';
import { MainHead, Footer, Navbar, SponsorMessage } from '@components/core';
import { Intro } from '@components/contributing';
import { getArticles } from 'utils-api/blog';

export const getStaticProps: GetStaticProps = async () => {
    const articles = await getArticles();

    return {
        props: {
            articles: articles,
        },
    };
};

const Contributing = () => {
    return (
        <>
            <MainHead
                title="Contributing"
                description="Thanks to our generous sponsors for supporting the project."
            />

            <Navbar />

            <Intro />

            <SponsorMessage />
            <Footer />
        </>
    );
};

export default Contributing;
