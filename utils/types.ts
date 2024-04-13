export type Nullable<D> = D | null | undefined;

export type APIResponseType<T> = {
    data: T;
    error?: string;
};

export type TagsType = 'languages' | 'other' | 'all';
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
    upvotePercentage?: number;
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
    value: string;
    tag_type: string;
}

export interface FrontMatter {
    title: string;
    date: string;
    author: string;
}

export interface MarkdownDocument {
    frontMatter: FrontMatter;
    content: string;
}

export interface BlogPostLink {
    title: string;
    slug: string;
}

export interface MarkdownRenderingResult {
    frontMatter: FrontMatter;
    html: string;
    prev?: BlogPostLink;
}

export interface ArticleMeta {
    title: string;
    date: string;
    author: string;
}

export interface Article {
    slug: string;
    meta: ArticleMeta;
    source: string;
    html: string;
    summary: string;
}

export interface ArticlePreview {
    slug: string;
    meta: ArticleMeta;
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

export interface SponsorData {
    name: string;
    url: string;
    description: string;
    tool: string;
    href: string;
    logo: {
        src: string;
        width: string;
        height: string;
    };
}

export interface LanguageData {
    name: string;
    website: string;
    description: string;
}

export interface ScreenshotApiData {
    [key: string]: Screenshot[];
}

export type Screenshot = {
    path: string;
    url: string;
};

export type RepositoryMeta = {
    owner: string;
    repo: string;
};

export type Stars = {
    date: string;
    count: number;
};

export type StarHistory = Stars[];

export interface StarHistoryApiData {
    [key: string]: StarHistory;
}

export interface Faq {
    question: string;
    answer: string;
}

export interface AffiliatesData {
    name: string;
    href: string;
    headline: string;
    description: string;
    callToAction: string;
    logo: string;
    tags: string[];
}
