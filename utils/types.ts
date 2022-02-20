export interface ToolsApiData {
    [key: string]: ApiTool;
}

export interface ApiTool {
    categories: string[];
    languages: string[];
    other: string[];
    licenses: string[];
    types: string[];
    homepage: string;
    source: string;
    description: string | null;
    discussion: string | null;
    deprecated: string | null;
    resources: string | null;
    wrapper: string | null;
}
