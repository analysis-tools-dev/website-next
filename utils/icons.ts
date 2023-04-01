import { Tool } from '@components/tools';

const iconAssetsPath = '/assets/icons';

export const tagIconPath = (language: string) => {
    return `${iconAssetsPath}/languages/${language}.svg`;
};

export const getToolTagIcon = (tool: Tool) => {
    const isMultiLanguage = tool.languages?.length > 1;

    if (isMultiLanguage) {
        return `${iconAssetsPath}/languages/multi-language.svg`;
    } else if (tool.languages?.length >= 1) {
        return tagIconPath(tool.languages[0]);
    } else if (tool.other?.length >= 1) {
        return tagIconPath(tool.other[0]);
    }
};
