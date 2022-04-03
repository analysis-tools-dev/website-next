import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { Article, type MarkdownDocument } from 'utils';
import NodeCache from 'node-cache';
import { isArticlesApiData } from 'utils/type-guards';

const cacheData = new NodeCache();

export const POSTS_PATH = join(process.cwd(), 'data', 'blog');

export const getSummaryFromContent = (postContent: string) => {
    if (!postContent || postContent === '') {
        return '';
    }
    // Generate summary if description not available
    const regEx = /^[A-Za-z].*(?:\n[A-Za-z].*)*/gm; // RegEx to match paragraphs
    const matches = postContent.match(regEx);

    if (matches) {
        const wordCount = matches[0].split(' ').length;
        if (wordCount < 30) {
            return matches[0] + matches[1];
        }
        return matches[0]; // Match first paragraph to be used as summary
    }
    return '';
};

export const getArticleFromFilename = (filename: string): Article => {
    const postFilePath = join(POSTS_PATH, filename);
    const fileContents = readFileSync(postFilePath);

    const { data, content } = matter(fileContents);

    const contentSummary = getSummaryFromContent(content);

    return {
        slug: filename.replace(/\.md?$/, ''),
        meta: {
            title: data.title,
            date: data.date,
        },
        source: content,
        html: markdownToHtml(content),
        summary: markdownToHtml(contentSummary),
    };
};

export const getParsedFileContentBySlug = (slug: string): MarkdownDocument => {
    const postFilePath = join(POSTS_PATH, `${slug}.md`);
    const fileContents = readFileSync(postFilePath);

    const { data, content } = matter(fileContents);

    return {
        frontMatter: data,
        content,
    };
};

export const markdownToHtml = (markdown: string) => {
    const html = marked.parse(markdown);
    return html ? html : '';
};

export const getArticles = async () => {
    const cacheKey = 'articles_data';
    try {
        // Get data from cache
        let data = cacheData.get(cacheKey);
        if (!data) {
            console.log(
                `Cache data for: ${cacheKey} does not exists - calling API`,
            );
            // Read aritcle files from dir and refresh cache
            const files = readdirSync(POSTS_PATH)
                // Filter anything other than .md files
                .filter((file) => file.indexOf('.md') > -1);

            data = files.map((file) => getArticleFromFilename(file));
            if (files) {
                const hours = Number(process.env.API_CACHE_TTL) || 24;
                cacheData.set(cacheKey, data, hours * 60 * 60);
            }
        }
        if (!isArticlesApiData(data)) {
            cacheData.del(cacheKey);
            console.log('Articles TypeError');
            return null;
        }
        return data;
    } catch (e) {
        console.log('Error occured: ', JSON.stringify(e));
        cacheData.del(cacheKey);
        return null;
    }
};
