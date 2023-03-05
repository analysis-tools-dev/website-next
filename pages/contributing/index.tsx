import { MainHead, Footer, Navbar, SponsorMessage } from '@components/core';
import { Intro } from '@components/contributing';

const Contributing = () => {
    return (
        <>
            <MainHead
                title="Contributing | Analysis Tools"
                description="Learn how to contribute to the Analysis Tools project by sending a pull request on Github."
            />

            <Navbar />

            <Intro />

            <SponsorMessage />
            <Footer />
        </>
    );
};

export default Contributing;
