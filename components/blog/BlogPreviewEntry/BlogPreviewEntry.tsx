import { FC } from 'react';
import Link from 'next/link';
import { PanelHeader } from '@components/elements';
import { Text } from '@components/typography';
import styles from './BlogPreviewEntry.module.css';

export interface BlogPreviewEntryProps {
    title: string;
    text: string;
    link: string;
}

const BlogPreviewEntry: FC<BlogPreviewEntryProps> = ({ title, text, link }) => {
    return (
        <div className={styles.previewCard}>
            <PanelHeader
                level={4}
                text={title}
                headingClass="font-size-15"
                className="m-b-8"
            />
            <Text className="font-light font-size-s">
                {text}
                <Link href={link}>
                    <a className="font-light font-size-s m-l-4">Read more</a>
                </Link>
            </Text>
        </div>
    );
};

export default BlogPreviewEntry;
