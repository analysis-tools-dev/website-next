import { FC } from 'react';
import { BlogPreview } from '@components/blog';
import { ContributionCard, Newsletter } from '@components/elements';
import { Sidebar } from '@components/layout';
import { type Tool } from '@components/tools';
import styles from './ToolInfoSidebar.module.css';
import InformationCard from './InformationCard/InformationCard';
import RepositoryCard from './RepositoryCard/RepositoryCard';

interface ToolInfoSidebarProps {
    tool: Tool;
}

const ToolInfoSidebar: FC<ToolInfoSidebarProps> = ({ tool }) => {
    return (
        <Sidebar className={styles.bottomSticky}>
            <InformationCard tool={tool} />
            {tool.repositoryData && (
                <RepositoryCard data={tool.repositoryData} />
            )}

            <ContributionCard />
            <BlogPreview />
            <Newsletter />
        </Sidebar>
    );
};

export default ToolInfoSidebar;
