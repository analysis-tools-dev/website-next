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
import { ArticlePreview } from 'utils/types';
import { LanguageFilterOption } from './FilterCard/LanguageFilterCard';
import { FilterOption } from './FilterCard/FilterCard';

export interface ToolsSidebarProps {
    articles: ArticlePreview[];
    languages: LanguageFilterOption[];
    others: FilterOption[];
}

const ToolsSidebar: FC<ToolsSidebarProps> = ({
    articles,
    languages,
    others,
}) => {
    const mergedLanguageOptions = [
        ...LANGUAGE_OPTIONS,
        ...languages.filter(
            (option) =>
                !LANGUAGE_OPTIONS.some(
                    (popular) => popular.value === option.value,
                ),
        ),
    ];

    return (
        <Sidebar className={styles.bottomSticky}>
            <LanguageFilterCard
                className={styles.filter}
                heading="Languages"
                filter="languages"
                options={mergedLanguageOptions}
                selectionMode="radio"
            />
            <FilterCard
                showAllCheckbox={false}
                className={styles.filter}
                heading="Categories"
                filter="categories"
                options={CATEGORY_OPTIONS}
            />
            <FilterCard
                showAllCheckbox={false}
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
                showAllCheckbox={false}
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
            <BlogPreview previews={articles} />
            <Newsletter />
        </Sidebar>
    );
};

export default ToolsSidebar;
