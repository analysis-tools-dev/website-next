import { FC } from 'react';
import { BlogPreview } from '@components/blog';
import { ContributionCard, Newsletter } from '@components/elements';
import { Sidebar } from '@components/layout';
import { FilterCard } from './FilterCard';
import styles from './ToolsSidebar.module.css';

import {
    CATEGORY_OPTIONS,
    TYPE_OPTIONS,
    LICENSE_OPTIONS,
} from '@appdata/filters';
import { type LanguageTag, type Article } from 'utils/types';

export interface ToolsSidebarProps {
    languages: LanguageTag[];
    articles: Article[];
}

const ToolsSidebar: FC<ToolsSidebarProps> = ({ articles, languages }) => {
    return (
        <Sidebar className={styles.bottomSticky}>
            <FilterCard
                heading="Language(s)"
                param="languages"
                options={languages}
            />
            <FilterCard
                heading="Category(s)"
                param="categories"
                options={CATEGORY_OPTIONS}
            />
            <FilterCard
                heading="Type(s)"
                param="types"
                options={TYPE_OPTIONS}
            />
            <FilterCard
                heading="License(s)"
                param="licenses"
                options={LICENSE_OPTIONS}
            />

            <ContributionCard />
            <BlogPreview articles={articles} />
            <Newsletter />
        </Sidebar>
    );
};

export default ToolsSidebar;
