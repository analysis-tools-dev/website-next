import { FC } from 'react';
import { BlogPreview } from '@components/blog';
import { Newsletter } from '@components/elements';
import { Sidebar } from '@components/layout';
import styles from './FilterSidebar.module.css';

const FilterSidebar: FC = () => {
    return (
        <Sidebar className={styles.bottomSticky}>
            <BlogPreview />
            <Newsletter />

            <BlogPreview />
            <Newsletter />
        </Sidebar>
    );
};

export default FilterSidebar;
