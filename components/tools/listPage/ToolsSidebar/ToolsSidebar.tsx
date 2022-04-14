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
import { useLanguagesQuery } from '@components/tools/api-utils';

const ToolsSidebar: FC = () => {
    const lagnuageResult = useLanguagesQuery();
    if (lagnuageResult.error || !lagnuageResult.data) {
        return null;
    }
    return (
        <Sidebar className={styles.bottomSticky}>
            <FilterCard
                heading="Language(s)"
                param="languages"
                options={lagnuageResult.data}
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

export default ToolsSidebar;
