import { BlogPreview } from '@components/blog';
import { Newsletter } from '@components/elements';
import { Sidebar } from '@components/layout';
import { FC } from 'react';

const HomepageSidebar: FC = () => {
    return (
        <Sidebar>
            <BlogPreview />
            <Newsletter />
        </Sidebar>
    );
};

export default HomepageSidebar;
