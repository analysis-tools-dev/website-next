import { FC } from 'react';
import { BlogPreview } from '@components/blog';
import { ContributionCard, Newsletter } from '@components/elements';
import { Sidebar } from '@components/layout';
import { FilterCard, LanguageFilterCard } from './FilterCard';
import styles from './ToolsSidebar.module.css';

import {
    LANGUAGE_OPTIONS,
    CATEGORY_OPTIONS,
    TYPE_OPTIONS,
    LICENSE_OPTIONS,
    PRICING_OPTIONS,
} from '@appdata/filters';
import { useLanguagesQuery } from '@components/tools/queries/languages';
import { useOthersQuery } from '@components/tools/queries/others';
import { Article } from 'utils/types';

export interface ToolsSidebarProps {
    articles: Article[];
}

const ToolsSidebar: FC<ToolsSidebarProps> = ({ articles }) => {
    const otherResult = useOthersQuery();
    const languageResult = useLanguagesQuery();

    if (otherResult.error || !otherResult.data) {
        return null;
    }
    if (languageResult.error || !languageResult.data) {
        return null;
    }
    return (
        <Sidebar className={styles.bottomSticky}>
            <LanguageFilterCard
                heading="Popular Languages"
                showAllCheckbox={false}
                filter="languages"
                options={LANGUAGE_OPTIONS}
            />
            <LanguageFilterCard
                heading="All Languages"
                filter="languages"
                options={languageResult.data}
            />
            <FilterCard
                heading="Categories"
                filter="categories"
                options={CATEGORY_OPTIONS}
            />
            <FilterCard heading="Types" filter="types" options={TYPE_OPTIONS} />
            <FilterCard
                heading="License"
                filter="licenses"
                options={LICENSE_OPTIONS}
            />
            <FilterCard
                heading="Pricing"
                filter="pricing"
                options={PRICING_OPTIONS}
            />
            <FilterCard
                heading="Other Tags"
                filter="others"
                options={otherResult.data}
                limit={4}
            />

            <ContributionCard />
            <BlogPreview articles={articles} />
            <Newsletter />
        </Sidebar>
    );
};

export default ToolsSidebar;
