import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { FrontMatter, type Article, type MarkdownDocument } from 'utils/types';

/**
 * Local file path for blog Posts markdown content
 */
export const POSTS_PATH = join(process.cwd(), 'data', 'blog');

/**
 * Generates a summary from post markdown content
 * @desc Only usable SERVER-SIDE!
 * @param {string} postContent - The title of the book.
 * @returns {string} First paragraph of content body
 */
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

/**
 * Reads and parses markdown file,to return usable `Article` object
 * @desc Only usable SERVERSIDE!
 * @param {string} filename - Markdown file name (with extension)
 * @returns {Article} Article object with parsed frontmatter and rendered HTML
 */
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
            author: data.author,
        },
        source: content,
        html: markdownToHtml(content),
        summary: markdownToHtml(contentSummary),
    };
};

/**
 * //TODO: Review function and add description here
 */
export const getParsedFileContentBySlug = (slug: string): MarkdownDocument => {
    const postFilePath = join(POSTS_PATH, `${slug}.md`);
    const fileContents = readFileSync(postFilePath);
    const { data, content } = matter(fileContents);

    return {
        frontMatter: data as FrontMatter,
        content,
    };
};

/**
 * Parses markdown content to HTML
 * @param {string} markdown - Markdown file contents
 * @returns {string} Parsed HTML contents
 */
export const markdownToHtml = (markdown: string) => {
    const html = marked.parse(markdown);
    return html ? html : '';
};

/**
 * Get all articles from the blog directory
 * @returns {Article[] | null} Array of articles sorted by date, or null on error
 */
export const getArticles = (): Article[] | null => {
    try {
        // Read article files from dir
        const files = readdirSync(POSTS_PATH)
            // Filter anything other than .md files
            .filter((file) => file.indexOf('.md') > -1);

        const articles = files.map((file) => getArticleFromFilename(file));

        return articles.sort((a, b) => (a.meta.date > b.meta.date ? -1 : 1));
    } catch (e) {
        console.error('Error reading articles: ', JSON.stringify(e));
        return null;
    }
};

/**
 * Get article previews (without full content) for listing pages
 * @returns {ArticlePreview[] | null} Array of article previews, or null on error
 */
export const getArticlesPreviews = () => {
    const articles = getArticles();
    if (!articles) {
        return null;
    }

    return articles.map((article) => ({
        slug: article.slug,
        meta: article.meta,
        summary: article.summary,
    }));
};
