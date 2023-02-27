import { FC } from 'react';
import { Newsletter } from '@components/elements';
import { Sidebar } from '@components/layout';
import { ArticlePreview } from 'utils/types';
import { BlogPreview } from '@components/blog';

export interface SponsorSidebarProps {
    previews: ArticlePreview[];
}

const SponsorSidebar: FC<SponsorSidebarProps> = ({ previews }) => {
    return (
        <Sidebar className="topSticky">
            <BlogPreview previews={previews} />
            <Newsletter />
        </Sidebar>
    );
};

export default SponsorSidebar;
