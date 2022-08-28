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
    PRICING_OPTIONS,
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
                heading="Languages"
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

            <ContributionCard />
            <BlogPreview />
            <Newsletter />
        </Sidebar>
    );
};

export default ToolsSidebar;
