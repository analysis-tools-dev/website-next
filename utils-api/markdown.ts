import { unified } from 'unified';
import markdown from 'remark-parse';
import remarkExtract from 'remark-extract-frontmatter';
import remarkStringify from 'remark-stringify';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';

// use remark to extract an all paragraphs after headline until next headline from a markdown file
export const getMarkdownSection = async (
    doc: string,
    heading: string,
): Promise<string> => {
    // get syntax tree of markdown doc
    const tree = unified()
        .use(markdown)
        .use(remarkExtract, { yaml: true })
        .parse(doc);

    // find the heading in the syntax tree
    const headingNode = tree.children.find(
        (node) => node.type === 'heading' && node.children[0].value === heading,
    );

    // if the heading was not found, return an empty string
    if (!headingNode) {
        return '';
    }

    // find the index of the heading in the syntax tree
    const headingIndex = tree.children.indexOf(headingNode);

    // get all nodes after the heading
    const nodesAfterHeading = tree.children.slice(headingIndex + 1);

    // find the index of the next heading in the syntax tree
    const nextHeadingIndex = nodesAfterHeading.findIndex(
        (node) => node.type === 'heading',
    );

    // if there is no next heading, return all nodes after the heading
    if (nextHeadingIndex === -1) {
        const file = await unified()
            .use(rehypeParse)
            .use(rehypeRemark)
            .use(remarkStringify, {
                bullet: '*',
                fence: '~',
                fences: true,
                incrementListMarker: false,
            })
            .process({ children: nodesAfterHeading });
        return file.toString();
    }

    // if there is a next heading, return all nodes between the heading and the next heading
    const file = await unified()
        .use(rehypeParse)
        .use(rehypeRemark)
        .use(remarkStringify, {
            bullet: '*',
            fence: '~',
            fences: true,
            incrementListMarker: false,
        })
        .process({ children: nodesAfterHeading.slice(0, nextHeadingIndex) });
    return file.toString();
};
