import { FC } from 'react';
import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MainHead, Footer, Navbar } from '@components/core';
import { Card, Main, Panel, Wrapper } from '@components/layout';
import LinkButton from '@components/elements/LinkButton/LinkButton';
import type { Tool } from '@components/tools/types';
import { ToolsRepository } from '@lib/repositories';
import {
    buildComparisonSlug,
    getDeterministicPair,
} from '@lib/comparisons/comparison-helpers';
import { tagIconPath } from 'utils/icons';
import styles from './CompareIndex.module.css';

type ComparisonItem = {
    slug: string;
    left: { id: string; name: string };
    right: { id: string; name: string };
    totalVotes: number;
    group: 'linter' | 'formatter' | 'service';
};

type LanguageSection = {
    language: string;
    comparisons: ComparisonItem[];
};

interface ComparisonOverviewProps {
    sections: LanguageSection[];
}

const normalize = (value: string): string => value.trim().toLowerCase();

const formatLanguageName = (value: string): string =>
    value
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

const getGroup = (tool: Tool): ComparisonItem['group'] | null => {
    const categories = (tool.categories || []).map(normalize);
    const types = (tool.types || []).map(normalize);

    if (categories.includes('linter')) return 'linter';
    if (categories.includes('formatter')) return 'formatter';
    if (types.includes('service')) return 'service';

    return null;
};

const getComparisonItemsForLanguage = (
    tools: Tool[],
    language: string,
): ComparisonItem[] => {
    const candidates = tools
        .filter((tool) => tool.languages?.length === 1)
        .filter((tool) => tool.languages[0] === language)
        .filter((tool) => !tool.deprecated)
        .map((tool) => ({ tool, group: getGroup(tool) }))
        .filter((entry) => entry.group !== null) as {
        tool: Tool;
        group: ComparisonItem['group'];
    }[];

    const comparisons: ComparisonItem[] = [];

    for (let i = 0; i < candidates.length; i += 1) {
        for (let j = i + 1; j < candidates.length; j += 1) {
            const leftCandidate = candidates[i];
            const rightCandidate = candidates[j];

            if (leftCandidate.group !== rightCandidate.group) continue;

            const [leftTool, rightTool] = getDeterministicPair(
                leftCandidate.tool,
                rightCandidate.tool,
            );

            comparisons.push({
                slug: buildComparisonSlug(leftTool.id, rightTool.id),
                left: { id: leftTool.id, name: leftTool.name },
                right: { id: rightTool.id, name: rightTool.name },
                totalVotes: (leftTool.votes || 0) + (rightTool.votes || 0),
                group: leftCandidate.group,
            });
        }
    }

    return comparisons;
};

const formatGroupLabel = (group: ComparisonItem['group']): string => {
    switch (group) {
        case 'linter':
            return 'Linter';
        case 'formatter':
            return 'Formatter';
        case 'service':
            return 'Service';
    }
};

export const getStaticProps: GetStaticProps = async () => {
    const toolsRepo = ToolsRepository.getInstance();
    const tools = toolsRepo.getAllAsArray();

    const languages = Array.from(
        new Set(
            tools
                .filter((tool) => tool.languages?.length === 1)
                .map((tool) => tool.languages[0]),
        ),
    ).sort((a, b) => a.localeCompare(b));

    const sections = languages
        .map((language) => {
            const comparisons = getComparisonItemsForLanguage(tools, language)
                .sort((a, b) => b.totalVotes - a.totalVotes)
                .slice(0, 3);

            return comparisons.length > 0 ? { language, comparisons } : null;
        })
        .filter((section): section is LanguageSection => section !== null);

    return {
        props: {
            sections,
        },
    };
};

const ComparisonOverviewPage: FC<ComparisonOverviewProps> = ({ sections }) => {
    const title = 'Compare Tools by Language | Analysis Tools';
    const description =
        'See the top comparisons for each language. We only compare tools that support a single language and match the same type (linters, formatters, services).';

    return (
        <>
            <MainHead title={title} description={description} />
            <Navbar />
            <Wrapper className={styles.page}>
                <Main>
                    <Panel>
                        <div className={styles.header}>
                            <div className={styles.title}>
                                Compare by Language
                            </div>
                            <div className={styles.subtitle}>
                                Top three comparisons per language, based on
                                total votes. We only show tools that focus on a
                                single language and compare like with like.
                            </div>
                        </div>

                        {sections.length === 0 ? (
                            <Card>
                                <p>No comparisons available yet.</p>
                            </Card>
                        ) : (
                            <div className={styles.section}>
                                {sections.map((section) => (
                                    <div
                                        key={section.language}
                                        className={styles.languageSection}>
                                        <div className={styles.languageHeader}>
                                            <Image
                                                src={tagIconPath(
                                                    section.language,
                                                )}
                                                alt={`${formatLanguageName(
                                                    section.language,
                                                )} logo`}
                                                width={20}
                                                height={20}
                                                className={styles.languageIcon}
                                            />
                                            <div>
                                                <div
                                                    className={
                                                        styles.languageTitle
                                                    }>
                                                    {formatLanguageName(
                                                        section.language,
                                                    )}
                                                </div>
                                                <div
                                                    className={
                                                        styles.languageSubtitle
                                                    }>
                                                    Top comparisons
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.comparisonList}>
                                            {section.comparisons.map(
                                                (comparison) => (
                                                    <div
                                                        key={comparison.slug}
                                                        className={
                                                            styles.comparisonCard
                                                        }>
                                                        <div>
                                                            <div
                                                                className={
                                                                    styles.comparisonTitle
                                                                }>
                                                                <Link
                                                                    href={`/compare/${comparison.slug}`}>
                                                                    {
                                                                        comparison
                                                                            .left
                                                                            .name
                                                                    }{' '}
                                                                    vs{' '}
                                                                    {
                                                                        comparison
                                                                            .right
                                                                            .name
                                                                    }
                                                                </Link>
                                                            </div>
                                                            <div
                                                                className={
                                                                    styles.comparisonMeta
                                                                }>
                                                                {formatGroupLabel(
                                                                    comparison.group,
                                                                )}{' '}
                                                                ·{' '}
                                                                {
                                                                    comparison.totalVotes
                                                                }{' '}
                                                                total votes
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.comparisonActions
                                                            }>
                                                            <LinkButton
                                                                label="Compare"
                                                                href={`/compare/${comparison.slug}`}
                                                                type="primary"
                                                            />
                                                            <Link
                                                                href={`/tool/${comparison.left.id}`}
                                                                className={
                                                                    styles.comparisonMeta
                                                                }>
                                                                {
                                                                    comparison
                                                                        .left
                                                                        .name
                                                                }
                                                            </Link>
                                                            <span
                                                                className={
                                                                    styles.comparisonMeta
                                                                }>
                                                                ·
                                                            </span>
                                                            <Link
                                                                href={`/tool/${comparison.right.id}`}
                                                                className={
                                                                    styles.comparisonMeta
                                                                }>
                                                                {
                                                                    comparison
                                                                        .right
                                                                        .name
                                                                }
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Panel>
                </Main>
            </Wrapper>
            <Footer />
        </>
    );
};

export default ComparisonOverviewPage;
