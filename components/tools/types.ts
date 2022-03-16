import { ToolPricePlan, ToolResource } from 'utils';

export interface Language {
    name: string;
    href: string;
    logo: string;
    description: string;
    infoLink: string;
    website: string;
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
    views?: number;
}
