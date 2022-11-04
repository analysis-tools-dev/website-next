import { FC } from 'react';
import { ContributionCard, Newsletter } from '@components/elements';
import { Sidebar } from '@components/layout';
import { SponsorCard } from '@components/core';
import { SponsorData } from 'utils/types';

export interface BlogSidebarProps {
    sponsors: SponsorData[];
}

const BlogSidebar: FC<BlogSidebarProps> = ({ sponsors }) => {
    return (
        <Sidebar className="bottomSticky">
            <SponsorCard sponsors={sponsors} />
            <ContributionCard />
            <Newsletter />
        </Sidebar>
    );
};

export default BlogSidebar;
