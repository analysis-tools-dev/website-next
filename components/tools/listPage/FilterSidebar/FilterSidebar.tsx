import { FC } from 'react';
import { BlogPreview } from '@components/blog';
import { ContributionCard, Newsletter } from '@components/elements';
import { Sidebar } from '@components/layout';
import { FilterCard } from './FilterCard';
import styles from './FilterSidebar.module.css';

// TODO: Retrieve language options for API
import {
    LANGUAGE_OPTIONS,
    CATEGORY_OPTIONS,
    TYPE_OPTIONS,
    LICENSE_OPTIONS,
} from '@appdata/filters';

const FilterSidebar: FC = () => {
    return (
        <Sidebar className={styles.bottomSticky}>
            <FilterCard
                heading="Language(s)"
                param="languages"
                options={LANGUAGE_OPTIONS}
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
            <BlogPreview />
            <Newsletter />
        </Sidebar>
    );
};

export default FilterSidebar;
