import { FC } from 'react';
import { ContributionCard, Newsletter } from '@components/elements';
import { Sidebar } from '@components/layout';
import { SponsorCard } from '@components/core';

const BlogSidebar: FC = () => {
    return (
        <Sidebar className="bottomSticky">
            <SponsorCard />
            <ContributionCard />
            <Newsletter />
        </Sidebar>
    );
};

export default BlogSidebar;
