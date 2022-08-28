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
import { useLanguagesQuery } from '@components/tools/queries/languages';

const ToolsSidebar: FC = () => {
    const languageResult = useLanguagesQuery();
    if (languageResult.error || !languageResult.data) {
        return null;
    }
    return (
        <Sidebar className={styles.bottomSticky}>
            <FilterCard
                heading="Language(s)"
                filter="languages"
                options={languageResult.data}
            />
            <FilterCard
                heading="Category(s)"
                filter="categories"
                options={CATEGORY_OPTIONS}
            />
            <FilterCard
                heading="Type(s)"
                filter="types"
                options={TYPE_OPTIONS}
            />
            <FilterCard
                heading="License(s)"
                filter="licenses"
                options={LICENSE_OPTIONS}
            />

            <ContributionCard />
            <BlogPreview />
            <Newsletter />
        </Sidebar>
    );
};

export default ToolsSidebar;
