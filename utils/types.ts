export type Nullable<D> = D | null | undefined;
export interface ToolsApiData {
    [key: string]: ApiTool;
}

export interface ApiTool {
    name: string;
    categories: string[];
    languages: string[];
    other: string[];
    licenses: string[];
    types: string[];
    homepage: string;
    source: string | null;
    pricing: string | null;
    plans: ToolPricePlan | null;
    description: string | null;
    discussion: string | null;
    deprecated: boolean | null;
    resources: ToolResource[] | null;
    wrapper: string | null;
    votes: number;
    upVotes?: number;
    downVotes?: number;
}

export interface ToolResource {
    title: string;
    url: string;
}

export interface ToolPricePlan {
    free: boolean;
    oss: boolean;
}

export interface TagsApiData {
    [key: string]: ApiTag[];
}

export interface ApiTag {
    name: string;
    tag: string;
    tag_type: string;
}

export interface FrontMatter {
    title: string;
    date: string;
}

export interface MarkdownDocument {
    frontMatter: FrontMatter;
    content: string;
}

export interface MarkdownRenderingResult {
    frontMatter: FrontMatter;
    html: string;
}

export interface ArticleMeta {
    title: string;
    date: string;
}

export interface Article {
    slug: string;
    meta: ArticleMeta;
    source: string;
    html: string;
    summary: string;
}

export interface LanguageTag {
    name: string;
    tag: string;
    tag_type: string;
}

export interface StatsApiData {
    [key: string]: string;
}

export interface VotesApiData {
    [key: string]: {
        sum: number;
        downVotes: number;
        upVotes: number;
    };
}
