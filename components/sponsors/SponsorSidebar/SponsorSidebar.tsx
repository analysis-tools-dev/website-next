import { FC } from 'react';
import { Newsletter } from '@components/elements';
import { Sidebar } from '@components/layout';
import { Article } from 'utils/types';
import { BlogPreview } from '@components/blog';

export interface SponsorSidebarProps {
    articles: Article[];
}

const SponsorSidebar: FC<SponsorSidebarProps> = ({ articles }) => {
    return (
        <Sidebar className="topSticky">
            <BlogPreview articles={articles} />
            <Newsletter />
        </Sidebar>
    );
};

export default SponsorSidebar;
