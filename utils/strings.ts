export const deCamelString = (str: string) => {
    if (!str) {
        return '';
    }
    return (
        str
            // insert a space before all caps
            .replace(/([A-Z])/g, ' $1')
            // uppercase the first character
            .replace(/^./, function (str) {
                return str.toUpperCase();
            })
    );
};

export const isValidHttpUrl = (str: string) => {
    let url;

    try {
        url = new URL(str);
    } catch {
        return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
};
