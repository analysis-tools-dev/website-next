import type { Tool } from '@components/tools/types';

export type ComparisonPair = {
    left: Tool;
    right: Tool;
    slug: string;
};

export type ComparisonOptions = {
    maxPairsPerTool?: number;
    requireSharedCategory?: boolean;
    requireSharedLanguage?: boolean;
    excludeDeprecated?: boolean;
};

const DEFAULT_OPTIONS: Required<ComparisonOptions> = {
    maxPairsPerTool: 8,
    requireSharedCategory: true,
    requireSharedLanguage: false,
    excludeDeprecated: false,
};

export const isEligibleTool = (tool: Tool): boolean => {
    if (!tool?.id || !tool?.name) return false;
    if (!Array.isArray(tool.categories) || tool.categories.length === 0) {
        return false;
    }
    if (!Array.isArray(tool.languages)) return false;
    return true;
};

export const normalizeValue = (value: string): string =>
    value.trim().toLowerCase();

export const normalizeList = (values: string[] = []): string[] =>
    values.map(normalizeValue).filter(Boolean);

export const intersection = (a: string[] = [], b: string[] = []): string[] => {
    const setB = new Set(normalizeList(b));
    return normalizeList(a).filter((value) => setB.has(value));
};

export const difference = (a: string[] = [], b: string[] = []): string[] => {
    const setB = new Set(normalizeList(b));
    return normalizeList(a).filter((value) => !setB.has(value));
};

export const slugify = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

export const buildComparisonSlug = (leftId: string, rightId: string): string =>
    `${slugify(leftId)}-vs-${slugify(rightId)}`;

export const getDeterministicPair = (a: Tool, b: Tool): [Tool, Tool] => {
    if (a.id === b.id) return [a, b];
    return a.id.localeCompare(b.id) < 0 ? [a, b] : [b, a];
};

export const shareCategory = (a: Tool, b: Tool): boolean =>
    intersection(a.categories, b.categories).length > 0;

export const shareLanguage = (a: Tool, b: Tool): boolean =>
    intersection(a.languages, b.languages).length > 0;

export const scoreSimilarity = (a: Tool, b: Tool): number => {
    const sharedCategories = intersection(a.categories, b.categories).length;
    const sharedLanguages = intersection(a.languages, b.languages).length;
    const sharedTypes = intersection(a.types, b.types).length;

    return sharedCategories * 5 + sharedLanguages * 3 + sharedTypes * 2;
};

export const generateComparisonPairs = (
    tools: Tool[],
    options: ComparisonOptions = {},
): ComparisonPair[] => {
    const config = { ...DEFAULT_OPTIONS, ...options };
    const eligible = tools.filter(isEligibleTool);

    const pairs: ComparisonPair[] = [];
    const pairSet = new Set<string>();

    for (const tool of eligible) {
        if (config.excludeDeprecated && tool.deprecated) {
            continue;
        }

        const candidates = eligible
            .filter((candidate) => candidate.id !== tool.id)
            .filter((candidate) =>
                config.excludeDeprecated ? !candidate.deprecated : true,
            )
            .filter((candidate) =>
                config.requireSharedCategory
                    ? shareCategory(tool, candidate)
                    : true,
            )
            .filter((candidate) =>
                config.requireSharedLanguage
                    ? shareLanguage(tool, candidate)
                    : true,
            )
            .map((candidate) => ({
                tool: candidate,
                score: scoreSimilarity(tool, candidate),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, config.maxPairsPerTool);

        for (const { tool: candidate } of candidates) {
            const [left, right] = getDeterministicPair(tool, candidate);
            const slug = buildComparisonSlug(left.id, right.id);

            if (pairSet.has(slug)) continue;
            pairSet.add(slug);

            pairs.push({
                left,
                right,
                slug,
            });
        }
    }

    return pairs;
};

export const getComparisonCandidatesForTool = (
    tools: Tool[],
    toolId: string,
    options: ComparisonOptions = {},
): ComparisonPair[] => {
    const config = { ...DEFAULT_OPTIONS, ...options };
    const tool = tools.find((entry) => entry.id === toolId);

    if (!tool || !isEligibleTool(tool)) return [];
    if (config.excludeDeprecated && tool.deprecated) return [];

    const eligible = tools.filter(isEligibleTool);
    const candidates = eligible
        .filter((candidate) => candidate.id !== tool.id)
        .filter((candidate) =>
            config.excludeDeprecated ? !candidate.deprecated : true,
        )
        .filter((candidate) =>
            config.requireSharedCategory
                ? shareCategory(tool, candidate)
                : true,
        )
        .filter((candidate) =>
            config.requireSharedLanguage
                ? shareLanguage(tool, candidate)
                : true,
        )
        .map((candidate) => ({
            tool: candidate,
            score: scoreSimilarity(tool, candidate),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, config.maxPairsPerTool);

    return candidates.map(({ tool: candidate }) => {
        const [left, right] = getDeterministicPair(tool, candidate);
        return {
            left,
            right,
            slug: buildComparisonSlug(left.id, right.id),
        };
    });
};
