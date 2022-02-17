import { FC } from 'react';
import { BlogPreview } from '@components/blog';
import { Newsletter } from '@components/elements';
import { Sidebar } from '@components/layout';
import styles from './HomepageSidebar.module.css';

const HomepageSidebar: FC = () => {
    return (
        <Sidebar className={styles.topSticky}>
            <BlogPreview />
            <Newsletter />
        </Sidebar>
    );
};

export default HomepageSidebar;
