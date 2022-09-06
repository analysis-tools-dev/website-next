import { type ToolPricePlan, type ToolResource } from 'utils/types';

export interface Language {
    name: string;
    href: string;
    logo: string;
    description: string;
    infoLink: string;
    website: string;
}

export interface RepositoryData {
    source: string;
    name: string;
    stars: number;
    issues: number;
    forks: number;
    created: string;
    updated: string;
}

export interface Tool {
    id: string;
    name: string;
    categories: string[];
    languages: string[];
    other: string[];
    licenses: string[];
    types: string[];
    homepage: string;
    source: string;
    pricing: string;
    plans: ToolPricePlan | null;
    description: string | null;
    discussion: string | null;
    deprecated: boolean | null;
    resources: ToolResource[] | null;
    wrapper: string | null;
    votes: number;
    upVotes?: number;
    downVotes?: number;
    views?: number;
    installation?: string;
    documentation?: string;
    repositoryData?: RepositoryData | null;
    stars?: { date: Date; count: number }[];
}

export interface ToolsByLanguage {
    [key: string]: {
        views: number;
        formatters: Tool[];
        linters: Tool[];
    };
}
