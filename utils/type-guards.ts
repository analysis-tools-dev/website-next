import { ApiTag, TagsApiData, ToolsApiData } from './types';

export const isToolsApiData = (data: unknown): data is ToolsApiData => {
    if (!data || typeof data !== 'object') {
        return false;
    }

    for (const key of Object.keys(data)) {
        const res =
            (data as ToolsApiData)[key].name !== undefined &&
            (data as ToolsApiData)[key].categories !== undefined &&
            (data as ToolsApiData)[key].languages !== undefined &&
            (data as ToolsApiData)[key].licenses !== undefined &&
            (data as ToolsApiData)[key].types !== undefined &&
            (data as ToolsApiData)[key].homepage !== undefined;

        if (!res) {
            return false;
        }
    }
    return true;
};

export const isApiTag = (data: unknown): data is ApiTag => {
    return (
        (data as ApiTag).name !== undefined &&
        (data as ApiTag).tag !== undefined &&
        (data as ApiTag).tag_type !== undefined
    );
};

export const isTagsApiData = (data: unknown): data is TagsApiData => {
    if (!data || typeof data !== 'object') {
        return false;
    }

    let result = true;

    for (const key of Object.keys(data)) {
        const res = (data as TagsApiData)[key].filter(isApiTag);

        if (!res.length) {
            result = false;
        }
    }
    return result;
};
