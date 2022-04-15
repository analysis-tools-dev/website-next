import { FC } from 'react';
import { BlogPreview } from '@components/blog';
import { ContributionCard, Newsletter } from '@components/elements';
import { Sidebar } from '@components/layout';
import { type Tool } from '@components/tools';
import styles from './ToolInfoSidebar.module.css';
import InformationCard from './InformationCard/InformationCard';
import RepositoryCard from './RepositoryCard/RepositoryCard';
import LicenseCard from './LicenseCard/LicenseCard';
import ResourcesCard from './ResourcesCard/ResourcesCard';
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
            <LicenseCard name={tool.name} licenses={tool.licenses} />
            <ResourcesCard resources={tool.resources} />

            <ContributionCard />
            <BlogPreview />
            <Newsletter />
        </Sidebar>
    );
};

export default ToolInfoSidebar;
