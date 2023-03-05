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

    const others = otherResult.data || [];

    const languages = languageResult.data || [];

    if (otherResult.error || !otherResult.data) {
        return null;
    }
    if (languageResult.error || !languageResult.data) {
        return null;
    }
    return (
        <Sidebar className={styles.bottomSticky}>
            <LanguageFilterCard
                className={styles.filter}
                heading="Popular Languages"
                showAllCheckbox={false}
                filter="languages"
                options={LANGUAGE_OPTIONS}
            />
            <LanguageFilterCard
                className={styles.filter}
                heading="All Languages"
                filter="languages"
                options={languages || []}
            />
            <FilterCard
                className={styles.filter}
                heading="Categories"
                filter="categories"
                options={CATEGORY_OPTIONS}
            />
            <FilterCard
                className={styles.filter}
                heading="Types"
                filter="types"
                options={TYPE_OPTIONS}
            />
            <FilterCard
                className={styles.filter}
                heading="License"
                filter="licenses"
                options={LICENSE_OPTIONS}
            />
            <FilterCard
                className={styles.filter}
                heading="Pricing"
                filter="pricing"
                options={PRICING_OPTIONS}
            />
            <FilterCard
                className={styles.filter}
                heading="Other Tags"
                filter="others"
                options={others || []}
                limit={4}
            />

            <ContributionCard />
            <BlogPreview articles={articles} />
            <Newsletter />
        </Sidebar>
    );
};

export default ToolsSidebar;
