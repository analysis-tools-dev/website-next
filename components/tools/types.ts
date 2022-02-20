export interface Language {
    name: string;
    href: string;
    logo: string;
    description: string;
    infoLink: string;
    website: string;
}

export interface Tool {
    name: string;
    href: string;
    languages: string[];
    votes: number;
    logo: string;
    license: string;
    type: string;
}
