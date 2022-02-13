export interface Language {
    name: string;
    href: string;
    logo: string;
}

export interface Tool {
    title: string;
    href: string;
    languages: string[];
    votes: number;
}
