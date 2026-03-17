import { FC } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { MainHead, Footer, Navbar } from '@components/core';
import { Card, Main, Panel, Wrapper } from '@components/layout';
import { PanelHeader } from '@components/elements';
import LinkButton from '@components/elements/LinkButton/LinkButton';
import type { Tool } from '@components/tools/types';
import { ToolsRepository } from '@lib/repositories';
import {
    buildComparisonSlug,
    generateComparisonPairs,
    getDeterministicPair,
} from '@lib/comparisons/comparison-helpers';
import styles from './Comparison.module.css';

interface ComparisonPageProps {
    left: Tool;
    right: Tool;
}

const normalize = (value: string): string => value.trim().toLowerCase();

const uniqueValues = (values: string[] = []): string[] => {
    const map = new Map<string, string>();
    for (const value of values) {
        const key = normalize(value);
        if (!key || map.has(key)) continue;
        map.set(key, value);
    }
    return Array.from(map.values());
};

const intersection = (a: string[] = [], b: string[] = []): string[] => {
    const bSet = new Set(b.map(normalize));
    return uniqueValues(a).filter((value) => bSet.has(normalize(value)));
};

const difference = (a: string[] = [], b: string[] = []): string[] => {
    const bSet = new Set(b.map(normalize));
    return uniqueValues(a).filter((value) => !bSet.has(normalize(value)));
};

const renderSummary = (values: string[] = [], limit = 6): string => {
    const items = uniqueValues(values);
    if (!items.length) return '—';
    const shown = items.slice(0, limit);
    const remaining = items.length - shown.length;
    return remaining > 0
        ? `${shown.join(', ')} +${remaining} more`
        : shown.join(', ');
};

const isUrl = (value: string): boolean => {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

const formatPricing = (tool: Tool): string => {
    if (tool.pricing) return tool.pricing;
    if (!tool.plans) return 'Unknown';
    const parts: string[] = [];
    if (tool.plans.free) parts.push('Free');
    if (tool.plans.oss) parts.push('Open Source');
    return parts.length ? parts.join(' / ') : 'Unknown';
};

const renderPricing = (tool: Tool) => {
    const pricing = formatPricing(tool);
    if (pricing === 'Unknown' || pricing === '—') return pricing;
    if (isUrl(pricing)) {
        return (
            <a
                href={pricing}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pricingLink}>
                Contact Sales
            </a>
        );
    }
    return pricing;
};

export const getStaticPaths: GetStaticPaths = async () => {
    const toolsRepo = ToolsRepository.getInstance();
    const tools = toolsRepo.getAllAsArray();

    const pairs = generateComparisonPairs(tools, {
        maxPairsPerTool: 8,
        requireSharedCategory: true,
        requireSharedLanguage: true,
        excludeDeprecated: true,
    });

    const paths = pairs.map((pair) => ({
        params: { slug: pair.slug },
    }));

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug?.toString();
    if (!slug) {
        return { notFound: true };
    }

    const toolsRepo = ToolsRepository.getInstance();
    const tools = toolsRepo.getAllAsArray();

    const pairs = generateComparisonPairs(tools, {
        maxPairsPerTool: 8,
        requireSharedCategory: true,
        requireSharedLanguage: true,
        excludeDeprecated: true,
    });

    const match = pairs.find((pair) => pair.slug === slug);
    if (!match) {
        return { notFound: true };
    }

    const [leftTool, rightTool] = getDeterministicPair(match.left, match.right);
    const canonicalSlug = buildComparisonSlug(leftTool.id, rightTool.id);

    if (canonicalSlug !== slug) {
        return {
            redirect: {
                destination: `/compare/${canonicalSlug}`,
                permanent: true,
            },
        };
    }

    const leftIcon = toolsRepo.getIcon(leftTool.id);
    const rightIcon = toolsRepo.getIcon(rightTool.id);

    return {
        props: {
            left: { ...leftTool, icon: leftIcon },
            right: { ...rightTool, icon: rightIcon },
        },
    };
};

const ComparisonPage: FC<ComparisonPageProps> = ({ left, right }) => {
    const title = `${left.name} vs ${right.name} | Analysis Tools`;
    const description = `Compare ${left.name} and ${right.name} by languages, categories, licenses, pricing, and popularity.`;

    const sharedLanguages = intersection(left.languages, right.languages);
    const sharedCategories = intersection(left.categories, right.categories);
    const leftOnlyTypes = difference(left.types, right.types);
    const rightOnlyTypes = difference(right.types, left.types);

    return (
        <>
            <MainHead title={title} description={description} />
            <Navbar />

            <Wrapper className={styles.page}>
                <Main>
                    <Panel>
                        <div className={styles.header}>
                            <div className={styles.title}>
                                {left.name} vs {right.name}
                            </div>
                            <div className={styles.subtitle}>
                                A simple side-by-side comparison using current
                                tool data.
                            </div>
                        </div>

                        <div className={styles.grid}>
                            <Card>
                                <div className={styles.cardHeader}>
                                    <div className={styles.toolName}>
                                        {left.name}
                                    </div>
                                </div>
                                <p>{left.description || '—'}</p>
                                <div className={styles.ctaRow}>
                                    <LinkButton
                                        label="View Tool"
                                        href={`/tool/${left.id}`}
                                        type="primary"
                                    />
                                    {left.homepage && (
                                        <LinkButton
                                            label="Visit Homepage"
                                            href={left.homepage}
                                            newTab={true}
                                            type="secondary"
                                        />
                                    )}
                                </div>
                            </Card>

                            <Card>
                                <div className={styles.cardHeader}>
                                    <div className={styles.toolName}>
                                        {right.name}
                                    </div>
                                </div>
                                <p>{right.description || '—'}</p>
                                <div className={styles.ctaRow}>
                                    <LinkButton
                                        label="View Tool"
                                        href={`/tool/${right.id}`}
                                        type="primary"
                                    />
                                    {right.homepage && (
                                        <LinkButton
                                            label="Visit Homepage"
                                            href={right.homepage}
                                            newTab={true}
                                            type="secondary"
                                        />
                                    )}
                                </div>
                            </Card>
                        </div>

                        <div className={styles.section}>
                            <PanelHeader
                                level={2}
                                text="Key Differences"></PanelHeader>
                            <Card>
                                <table className={styles.compareTable}>
                                    <thead>
                                        <tr>
                                            <th>Attribute</th>
                                            <th>{left.name}</th>
                                            <th>{right.name}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Languages</td>
                                            <td>
                                                {renderSummary(left.languages)}
                                            </td>
                                            <td>
                                                {renderSummary(right.languages)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Categories</td>
                                            <td>
                                                {renderSummary(left.categories)}
                                            </td>
                                            <td>
                                                {renderSummary(
                                                    right.categories,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Types</td>
                                            <td>
                                                {renderSummary(left.types)}
                                                {leftOnlyTypes.length > 0 && (
                                                    <div>
                                                        <span
                                                            className={
                                                                styles.uniqueLabel
                                                            }>
                                                            Unique
                                                        </span>
                                                        <div>
                                                            {renderSummary(
                                                                leftOnlyTypes,
                                                                4,
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {renderSummary(right.types)}
                                                {rightOnlyTypes.length > 0 && (
                                                    <div>
                                                        <span
                                                            className={
                                                                styles.uniqueLabel
                                                            }>
                                                            Unique
                                                        </span>
                                                        <div>
                                                            {renderSummary(
                                                                rightOnlyTypes,
                                                                4,
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Licenses</td>
                                            <td>
                                                {renderSummary(left.licenses)}
                                            </td>
                                            <td>
                                                {renderSummary(right.licenses)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Pricing</td>
                                            <td>{renderPricing(left)}</td>
                                            <td>{renderPricing(right)}</td>
                                        </tr>
                                        <tr>
                                            <td>Votes</td>
                                            <td>{left.votes}</td>
                                            <td>{right.votes}</td>
                                        </tr>
                                        <tr>
                                            <td>Upvote %</td>
                                            <td>
                                                {left.upvotePercentage
                                                    ? `${left.upvotePercentage}%`
                                                    : '—'}
                                            </td>
                                            <td>
                                                {right.upvotePercentage
                                                    ? `${right.upvotePercentage}%`
                                                    : '—'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Shared Languages</td>
                                            <td colSpan={2}>
                                                {renderSummary(sharedLanguages)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Shared Categories</td>
                                            <td colSpan={2}>
                                                {renderSummary(
                                                    sharedCategories,
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </Panel>
                </Main>
            </Wrapper>

            <Footer />
        </>
    );
};

export default ComparisonPage;
