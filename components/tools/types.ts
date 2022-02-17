export interface Language {
    name: string;
    href: string;
    logo: string;
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
