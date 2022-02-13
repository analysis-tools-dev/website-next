import { FC } from 'react';
import Link from 'next/link';
import { PanelHeader } from '@components/elements';
import { LanguageTopToolsWidget } from '@components/tools';

const PopularToolsByLanguage: FC = () => {
    const toolsByLanguage = [
        {
            language: {
                name: 'Python',
                href: '/language/python',
                logo: '/assets/icons/languages/python.svg',
            },
            topFormatters: [
                {
                    title: 'Black',
                    href: '/tools/test',
                    languages: ['Python'],
                    votes: 2540,
                },
                {
                    title: 'Unimport',
                    href: '/tools/test2',
                    languages: ['Python', 'JavaScript'],
                    votes: 1120,
                },
                {
                    title: 'Unibeautify',
                    href: '/tools/test2',
                    languages: ['Python', 'JavaScript'],
                    votes: 1120,
                },
                {
                    title: 'Black',
                    href: '/tools/test',
                    languages: ['Python'],
                    votes: 2540,
                },
                {
                    title: 'Unimport',
                    href: '/tools/test2',
                    languages: ['Python', 'JavaScript'],
                    votes: 1120,
                },
                {
                    title: 'Unibeautify',
                    href: '/tools/test2',
                    languages: ['Python', 'JavaScript'],
                    votes: 1120,
                },
            ],
            topLinters: [
                {
                    title: 'Mega-Linter',
                    href: '/tools/test',
                    languages: ['Python', 'JavaScript'],
                    votes: 1740,
                },
                {
                    title: 'mypy',
                    href: '/tools/test',
                    languages: ['Python'],
                    votes: 1220,
                },
                {
                    title: 'Semgrep',
                    href: '/tools/test',
                    languages: ['Python', 'JavaScript'],
                    votes: 582,
                },
                {
                    title: 'Mega-Linter',
                    href: '/tools/test',
                    languages: ['Python', 'JavaScript'],
                    votes: 1740,
                },
                {
                    title: 'mypy',
                    href: '/tools/test',
                    languages: ['Python'],
                    votes: 1220,
                },
                {
                    title: 'Semgrep',
                    href: '/tools/test',
                    languages: ['Python', 'JavaScript'],
                    votes: 582,
                },
                {
                    title: 'Mega-Linter',
                    href: '/tools/test',
                    languages: ['Python', 'JavaScript'],
                    votes: 1740,
                },
                {
                    title: 'mypy',
                    href: '/tools/test',
                    languages: ['Python'],
                    votes: 1220,
                },
                {
                    title: 'Semgrep',
                    href: '/tools/test',
                    languages: ['Python', 'JavaScript'],
                    votes: 582,
                },
            ],
        },
        {
            language: {
                name: 'Ruby',
                href: '/language/ruby',
                logo: '/assets/icons/languages/ruby.svg',
            },
            topFormatters: [
                {
                    title: 'Include Gardner',
                    href: '/tools/test',
                    languages: ['Ruby', 'JavaScript'],
                    votes: 2540,
                },
                {
                    title: 'Rufo',
                    href: '/tools/test2',
                    languages: ['Ruby', 'JavaScript'],
                    votes: 1120,
                },
            ],
            topLinters: [
                {
                    title: 'Mega-Linter',
                    href: '/tools/test',
                    languages: ['Python', 'JavaScript'],
                    votes: 1740,
                },
                {
                    title: 'Semgrep',
                    href: '/tools/test',
                    languages: ['Python', 'JavaScript'],
                    votes: 582,
                },
                {
                    title: 'RuboCop',
                    href: '/tools/test',
                    languages: ['Ruby'],
                    votes: 1220,
                },
                {
                    title: 'Mega-Linter',
                    href: '/tools/test',
                    languages: ['Python', 'JavaScript'],
                    votes: 1740,
                },
                {
                    title: 'Semgrep',
                    href: '/tools/test',
                    languages: ['Python', 'JavaScript'],
                    votes: 582,
                },
                {
                    title: 'RuboCop',
                    href: '/tools/test',
                    languages: ['Ruby'],
                    votes: 1220,
                },
                {
                    title: 'Mega-Linter',
                    href: '/tools/test',
                    languages: ['Python', 'JavaScript'],
                    votes: 1740,
                },
                {
                    title: 'Semgrep',
                    href: '/tools/test',
                    languages: ['Python', 'JavaScript'],
                    votes: 582,
                },
                {
                    title: 'RuboCop',
                    href: '/tools/test',
                    languages: ['Ruby'],
                    votes: 1220,
                },
            ],
        },
    ];
    return (
        <>
            <PanelHeader
                level={2}
                text="Popular Static Analysis Tools by Language">
                {toolsByLanguage.length > 3 ? (
                    <Link href="/languages">
                        {`Show all (${toolsByLanguage.length})`}
                    </Link>
                ) : null}
            </PanelHeader>

            {toolsByLanguage.map((entry, index) => (
                <LanguageTopToolsWidget
                    key={index}
                    language={entry.language}
                    formatters={entry.topFormatters}
                    linters={entry.topLinters}
                />
            ))}
        </>
    );
};

export default PopularToolsByLanguage;
