import { useQuery } from 'react-query';
import { type Article } from 'utils/types';
import { APIPaths, getApiURL } from 'utils/urls';

export function useArticlesQuery() {
    return useQuery('articles', fetchArticles);
}

export function useArticleQueryCount() {
    return useQuery('articles', fetchArticles, {
        select: (articles) => articles.length,
    });
}

export function fetchArticles(): Promise<Article[]> {
    const articlesApiURL = getApiURL(APIPaths.BLOG);
    return fetch(articlesApiURL).then((response) => response.json());
}
