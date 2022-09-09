export const sponsors = [
    {
        name: 'DeepCode',
        tools: ['deepcode', 'snyk'],
        href: '/sponsor/deep-code',
        logo: '/assets/images/sponsors/deepcode.png',
        width: '200px',
        height: '54px',
        external: false,
    },
    {
        name: 'CodeScene',
        tools: ['codescene'],
        href: '/sponsor/code-scene',
        logo: '/assets/images/sponsors/codescene.svg',
        width: '200px',
        height: '50px',
        external: false,
    },
    {
        name: 'semgrep',
        tools: ['semgrep'],
        href: '/sponsor/semgrep',
        logo: '/assets/images/sponsors/semgrep.svg',
        width: '100px',
        height: '80px',
        external: false,
    },
    {
        name: 'Codiga',
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
