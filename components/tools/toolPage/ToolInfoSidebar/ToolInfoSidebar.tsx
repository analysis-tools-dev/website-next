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
import GithubStarsCard from './GithubStarsCard/GithubStarsCard';
import { ArticlePreview } from 'utils/types';
interface ToolInfoSidebarProps {
    tool: Tool;
    previews: ArticlePreview[];
}

const ToolInfoSidebar: FC<ToolInfoSidebarProps> = ({ tool, previews }) => {
    return (
        <Sidebar className={styles.bottomSticky}>
            <InformationCard tool={tool} />
            {tool && tool.stars && <GithubStarsCard tool={tool} />}
            {tool.repositoryData && (
                <RepositoryCard data={tool.repositoryData} />
            )}
            <LicenseCard
                name={tool.name}
                licenses={tool.licenses}
                pricing={tool.pricing}
            />
            <ResourcesCard resources={tool.resources} />

            <ContributionCard />
            <BlogPreview previews={previews} />
            <Newsletter />
        </Sidebar>
    );
};

export default ToolInfoSidebar;
