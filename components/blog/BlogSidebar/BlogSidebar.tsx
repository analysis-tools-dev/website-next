import { FC } from 'react';
import { ContributionCard, Newsletter } from '@components/elements';
import { Sidebar } from '@components/layout';
import { SponsorCard } from '@components/core';

const BlogSidebar: FC = () => {
    return (
        <Sidebar>
            <SponsorCard />
            <ContributionCard />
            <Newsletter />
        </Sidebar>
    );
};

export default BlogSidebar;
