import { FC } from 'react';
import styles from './ArticleList.module.css';
import { Article } from 'utils/types';
import { Card } from '@components/layout';
import { BlogPreviewEntry } from '../BlogPreviewEntry';

export interface ArticleListProps {
    articles: Article[];
}

// TODO: Add new component for blog preview entry with meta data
const ArticleList: FC<ArticleListProps> = ({ articles }) => {
    return articles ? (
        <ul className={styles.articleList}>
            {articles.map((post, index) => (
                <li key={index}>
                    <Card>
                        <BlogPreviewEntry
                            title={post.meta?.title}
                            summary={post.summary}
                            link={`/blog/${post.slug}`}
                        />
                    </Card>
                </li>
            ))}
        </ul>
    ) : null;
};

export default ArticleList;
