import fs from 'fs';

// Create a slug from a string.
export const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
};

// Get the screenshot URL for a tool.
export const getScreenshotsPath = (slug: string) => {
    // // Make sure this function only gets called on the server.
    // if (typeof window !== 'undefined') {
    //     return [];
    // }

    // Remove protocol from url for nicer file names.
    const urlClean = slug.replace(/(^\w+:|^)\/\/(www)?/, '');
    const urls: string[] = [];

    ['github', 'websites'].forEach((outDir) => {
        const outPath = `${outDir}/${slugify(urlClean)}.jpg`;
        const outURL = outPath.replace(/^static/, '');

        if (fs.existsSync('./public/assets/images/screenshots/' + outURL)) {
            urls.push('/assets/images/screenshots/' + outURL);
        }
    });
    return urls;
};
