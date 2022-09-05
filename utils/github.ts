export const getRepositoryMeta = (source: string) => {
    if (!source || source === '') {
        return null;
    }
    const urlData = source.split('/');
    const baseIndex = urlData.findIndex((el) => el === 'github.com');
    if (!baseIndex) {
        return null;
    }
    return {
        owner: urlData[baseIndex + 1],
        repo: urlData[baseIndex + 2],
    };
};
