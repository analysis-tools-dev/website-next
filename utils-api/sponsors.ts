export const sponsors = [
    {
        name: 'DeepCode',
        url: 'https://www.deepcode.ai/',
        description:
            'DeepCode is a code review tool that helps developers write better code. It uses machine learning to analyze code and find bugs, security vulnerabilities, and performance issues.',
        tools: ['deepcode', 'snyk'],
        href: '/sponsor/deep-code',
        logo: '/assets/images/sponsors/deepcode.png',
        width: '200px',
        height: '54px',
        external: false,
    },
    {
        name: 'CodeScene',
        url: 'https://codescene.com/',
        description:
            'CodeScene is a code intelligence platform that helps you understand your codebase and improve it.',
        tools: ['codescene'],
        href: '/sponsor/code-scene',
        logo: '/assets/images/sponsors/codescene.svg',
        width: '200px',
        height: '50px',
        external: false,
    },
    {
        name: 'semgrep',
        url: 'https://semgrep.dev/',
        description:
            'semgrep is a fast, open-source, static analysis tool for finding bugs and enforcing code standards.',
        tools: ['semgrep'],
        href: '/sponsor/semgrep',
        logo: '/assets/images/sponsors/semgrep.svg',
        width: '100px',
        height: '80px',
        external: false,
    },
    {
        name: 'Codiga',
        url: 'https://codiga.io/',
        description: 'Codiga is a code review tool for developers.',
        tools: ['codiga'],
        href: '/sponsor/codiga',
        logo: '/assets/images/sponsors/codiga.svg',
        width: '72px',
        height: '65px',
        external: false,
    },
];

// Check if tool is a sponsor by checking if the tool name is in any of the
// tools fields of the sponsor object
export const isSponsor = (toolSlug: string) => {
    return sponsors.some((sponsor) =>
        sponsor.tools.some((toolName) => toolName === toolSlug),
    );
};
