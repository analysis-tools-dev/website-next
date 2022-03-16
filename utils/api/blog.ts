import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { type MarkdownDocument } from 'utils';

export const getParsedFileContentBySlug = (
    slug: string,
    postsPath: string,
): MarkdownDocument => {
    const postFilePath = join(postsPath, `${slug}.md`);
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
