import { FC } from 'react';
import { BlogPreview } from '@components/blog';
import { ContributionCard, Newsletter } from '@components/elements';
import { Sidebar } from '@components/layout';
import { FilterCard, RelatedCard } from './FilterCard';
import { OnFilterChange } from '@components/tags/types';
import styles from './TagsSidebar.module.css';

import {
    CATEGORY_OPTIONS,
    TYPE_OPTIONS,
    LICENSE_OPTIONS,
    PRICING_OPTIONS,
} from '@appdata/filters';
import { ArticlePreview } from 'utils/types';
import { LanguageFilterOption } from './FilterCard/LanguageFilterCard';

export interface TagsSidebarProps {
    previews: ArticlePreview[];
    relatedLanguages: LanguageFilterOption[];
    onFilterChange: OnFilterChange;
}

const TagsSidebar: FC<TagsSidebarProps> = ({
    previews,
    relatedLanguages: languages,
    onFilterChange,
}) => {
    return (
        <Sidebar className={styles.bottomSticky}>
            <RelatedCard className={styles.filter} options={languages} />
            <FilterCard
                className={styles.filter}
                heading="Categories"
                filter="categories"
                options={CATEGORY_OPTIONS}
                onFilterChange={onFilterChange}
            />
            <FilterCard
                className={styles.filter}
                heading="Types"
                filter="types"
                options={TYPE_OPTIONS}
                onFilterChange={onFilterChange}
            />
            <FilterCard
                className={styles.filter}
                heading="License"
                filter="licenses"
                options={LICENSE_OPTIONS}
                onFilterChange={onFilterChange}
            />
            <FilterCard
                className={styles.filter}
                heading="Pricing"
                filter="pricing"
                options={PRICING_OPTIONS}
                onFilterChange={onFilterChange}
            />

            <BlogPreview previews={previews} />
            <ContributionCard />
            <Newsletter />
        </Sidebar>
    );
};

export default TagsSidebar;
