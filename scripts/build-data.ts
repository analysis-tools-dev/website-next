/**
 * Build-time data fetching script
 *
 * This script fetches tools data from the analysis-tools-dev GitHub repositories
 * and consolidates them into a single static JSON file for use at runtime.
 * Also fetches votes from Firestore if credentials are available.
 *
 * Run with: npm run build-data
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { Firestore } from '@google-cloud/firestore';

// Types (raw source data vs. enriched output data)
interface RawToolData {
    name: string;
    categories: string[];
    languages: string[];
    other: string[];
    licenses: string[];
    types: string[];
    homepage: string;
    source: string | null;
    pricing: string | null;
    plans: { free?: boolean; oss?: boolean } | null;
    description: string | null;
    discussion: string | null;
    deprecated: boolean | null;
    resources: { title: string; url: string }[] | null;
    reviews: unknown | null;
    demos: unknown | null;
    wrapper: string | null;
}

interface ToolData extends RawToolData {
    votes: number;
    upVotes: number;
    downVotes: number;
    upvotePercentage: number;
}

type RawToolsData = Record<string, RawToolData>;
type EnrichedToolsData = Record<string, ToolData>;

interface StatsData {
    [key: string]: number;
}

interface VotesData {
    [key: string]: {
        sum: number;
        upVotes: number;
        downVotes: number;
    };
}

interface BuildOutput {
    tools: EnrichedToolsData;
    meta: {
        buildTime: string;
        staticAnalysisCount: number;
        dynamicAnalysisCount: number;
        totalCount: number;
    };
}

// GitHub raw content URLs
const STATIC_ANALYSIS_URL =
    'https://raw.githubusercontent.com/analysis-tools-dev/static-analysis/master/data/api/tools.json';
const DYNAMIC_ANALYSIS_URL =
    'https://raw.githubusercontent.com/analysis-tools-dev/dynamic-analysis/master/data/api/tools.json';
const TOOL_STATS_URL =
    'https://raw.githubusercontent.com/analysis-tools-dev/static-analysis/master/data/api/stats/tools.json';
const TAG_STATS_URL =
    'https://raw.githubusercontent.com/analysis-tools-dev/static-analysis/master/data/api/stats/tags.json';

// Output paths
const OUTPUT_DIR = path.join(process.cwd(), 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'tools.json');
const TOOL_STATS_FILE = path.join(OUTPUT_DIR, 'tool-stats.json');
const TAG_STATS_FILE = path.join(OUTPUT_DIR, 'tag-stats.json');

/**
 * Fetch JSON data from a URL
 */
function fetchJSON<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
        console.log(`Fetching: ${url}`);

        https
            .get(url, (res) => {
                if (res.statusCode !== 200) {
                    reject(
                        new Error(
                            `Failed to fetch ${url}: HTTP ${res.statusCode}`,
                        ),
                    );
                    return;
                }

                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data) as T;
                        resolve(parsed);
                    } catch (e) {
                        reject(new Error(`Failed to parse JSON from ${url}`));
                    }
                });
            })
            .on('error', (e) => {
                reject(new Error(`Failed to fetch ${url}: ${e.message}`));
            });
    });
}

/**
 * Merge tools from multiple sources, handling duplicates
 */
function mergeTools(
    staticTools: RawToolsData,
    dynamicTools: RawToolsData,
): RawToolsData {
    const merged: RawToolsData = { ...staticTools };

    for (const [id, tool] of Object.entries(dynamicTools)) {
        if (merged[id]) {
            // Tool exists in both - merge categories and types
            console.log(`Merging duplicate tool: ${id}`);
            merged[id] = {
                ...merged[id],
                categories: [
                    ...new Set([...merged[id].categories, ...tool.categories]),
                ],
                types: [...new Set([...merged[id].types, ...tool.types])],
            };
        } else {
            merged[id] = tool;
        }
    }

    return merged;
}

/**
 * Validate tool data
 */
function validateTools(tools: RawToolsData): void {
    const errors: string[] = [];

    for (const [id, tool] of Object.entries(tools)) {
        if (!tool.name) {
            errors.push(`Tool "${id}" is missing a name`);
        }
        if (!Array.isArray(tool.categories)) {
            errors.push(`Tool "${id}" has invalid categories`);
        }
        if (!Array.isArray(tool.languages)) {
            errors.push(`Tool "${id}" has invalid languages`);
        }
        if (!Array.isArray(tool.types)) {
            errors.push(`Tool "${id}" has invalid types`);
        }
    }

    if (errors.length > 0) {
        console.warn('Validation warnings:');
        errors.forEach((e) => console.warn(`  - ${e}`));
    }
}

/**
 * Extract unique tags (languages and others) from tools
 */
function extractTags(tools: EnrichedToolsData): {
    languages: string[];
    others: string[];
} {
    const languages = new Set<string>();
    const others = new Set<string>();

    for (const tool of Object.values(tools)) {
        tool.languages?.forEach((lang) => languages.add(lang));
        tool.other?.forEach((other) => others.add(other));
    }

    return {
        languages: Array.from(languages).sort(),
        others: Array.from(others).sort(),
    };
}

/**
 * Fetch stats data (tool views, tag views)
 */
async function fetchStats(): Promise<{
    toolStats: StatsData;
    tagStats: StatsData;
}> {
    try {
        const [toolStats, tagStats] = await Promise.all([
            fetchJSON<StatsData>(TOOL_STATS_URL),
            fetchJSON<StatsData>(TAG_STATS_URL),
        ]);

        // Normalize tag stats keys (remove /tag/ prefix)
        const normalizedTagStats: StatsData = {};
        for (const [key, value] of Object.entries(tagStats)) {
            const normalizedKey = key.replace('/tag/', '');
            normalizedTagStats[normalizedKey] = value;
        }

        return { toolStats, tagStats: normalizedTagStats };
    } catch (error) {
        console.warn('Warning: Could not fetch stats data:', error);
        return { toolStats: {}, tagStats: {} };
    }
}

/**
 * Fetch votes from Firestore
 * Fails fast if credentials are not configured
 */
async function fetchVotes(): Promise<VotesData> {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        throw new Error(
            'GOOGLE_APPLICATION_CREDENTIALS is not set. ' +
                'Votes are required for the build. ' +
                'Please set up Google Cloud credentials to access Firestore.',
        );
    }

    const db = new Firestore({ projectId: 'analysis-tools-dev' });
    const snapshot = await db.collection('tags').get();

    const votes: VotesData = {};
    snapshot.docs.forEach((doc) => {
        const data = doc.data();
        votes[doc.id] = {
            sum: data.sum || 0,
            upVotes: data.upVotes || 0,
            downVotes: data.downVotes || 0,
        };
    });

    console.log(`Fetched ${Object.keys(votes).length} votes from Firestore`);
    return votes;
}

/**
 * Calculate upvote percentage
 */
function calculateUpvotePercentage(upVotes: number, downVotes: number): number {
    const totalVotes = upVotes + downVotes;
    if (totalVotes === 0) {
        return 0;
    }
    return Math.round((upVotes / totalVotes) * 100);
}

/**
 * Add votes to tools
 */
function addVotesToTools(
    tools: RawToolsData,
    votes: VotesData,
): EnrichedToolsData {
    const result: EnrichedToolsData = {};

    for (const [id, tool] of Object.entries(tools)) {
        const key = `toolsyaml${id}`;
        const v = votes[key];

        const upVotes = v?.upVotes || 0;
        const downVotes = v?.downVotes || 0;

        result[id] = {
            ...tool,
            votes: v?.sum || 0,
            upVotes,
            downVotes,
            upvotePercentage: calculateUpvotePercentage(upVotes, downVotes),
        };
    }

    return result;
}

/**
 * Main build function
 */
async function main(): Promise<void> {
    console.log('Building tools data...\n');

    try {
        // Fetch data from both repositories, stats, and votes
        const [staticTools, dynamicTools, stats, votes] = await Promise.all([
            fetchJSON<RawToolsData>(STATIC_ANALYSIS_URL),
            fetchJSON<RawToolsData>(DYNAMIC_ANALYSIS_URL),
            fetchStats(),
            fetchVotes(),
        ]);

        const staticCount = Object.keys(staticTools).length;
        const dynamicCount = Object.keys(dynamicTools).length;

        console.log(`\nFetched ${staticCount} static analysis tools`);
        console.log(`Fetched ${dynamicCount} dynamic analysis tools`);

        // Merge tools
        const rawTools = mergeTools(staticTools, dynamicTools);
        const totalCount = Object.keys(rawTools).length;
        console.log(`Total unique tools: ${totalCount}`);

        // Add votes to tools
        const enrichedTools = addVotesToTools(rawTools, votes);

        // Validate
        validateTools(rawTools);

        // Extract tags for reference
        const tags = extractTags(enrichedTools);
        console.log(`\nFound ${tags.languages.length} unique languages`);
        console.log(`Found ${tags.others.length} unique other tags`);

        // Stats info
        const toolStatsCount = Object.keys(stats.toolStats).length;
        const tagStatsCount = Object.keys(stats.tagStats).length;
        console.log(`\nFetched stats for ${toolStatsCount} tools`);
        console.log(`Fetched stats for ${tagStatsCount} tags`);

        // Prepare output
        const output: BuildOutput = {
            tools: enrichedTools,
            meta: {
                buildTime: new Date().toISOString(),
                staticAnalysisCount: staticCount,
                dynamicAnalysisCount: dynamicCount,
                totalCount,
            },
        };

        // Ensure output directory exists
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        // Write output file
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
        console.log(`\nWritten to ${OUTPUT_FILE}`);

        // Also write tags for reference (useful for filters)
        const tagsFile = path.join(OUTPUT_DIR, 'tags.json');
        fs.writeFileSync(tagsFile, JSON.stringify(tags, null, 2));
        console.log(`Written tags to ${tagsFile}`);

        // Write stats files
        fs.writeFileSync(
            TOOL_STATS_FILE,
            JSON.stringify(stats.toolStats, null, 2),
        );
        console.log(`Written tool stats to ${TOOL_STATS_FILE}`);

        fs.writeFileSync(
            TAG_STATS_FILE,
            JSON.stringify(stats.tagStats, null, 2),
        );
        console.log(`Written tag stats to ${TAG_STATS_FILE}`);

        console.log('\nBuild complete!');
    } catch (error) {
        console.error('\nBuild failed:', error);
        process.exit(1);
    }
}

main();
