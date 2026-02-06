/**
 * Static Data Reader
 *
 * This module provides utilities for reading the pre-built static tools data.
 * Data is fetched at build time by scripts/build-data.ts and stored in data/tools.json.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ToolsApiData, ApiTool, StatsApiData } from './types';

// Types for the build output format
export interface BuildMeta {
    buildTime: string;
    staticAnalysisCount: number;
    dynamicAnalysisCount: number;
    totalCount: number;
}

export interface StaticToolsData {
    tools: ToolsApiData;
    meta: BuildMeta;
}

export interface StaticTagsData {
    languages: string[];
    others: string[];
}

// Cache for loaded data (within the same build/request)
let toolsCache: StaticToolsData | null = null;
let tagsCache: StaticTagsData | null = null;
let toolStatsCache: StatsApiData | null = null;
let tagStatsCache: StatsApiData | null = null;

/**
 * Get the path to a data file
 */
function getDataPath(filename: string): string {
    return path.join(process.cwd(), 'data', filename);
}

/**
 * Load and parse a JSON file
 */
function loadJSON<T>(filepath: string): T {
    const content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content) as T;
}

/**
 * Get all tools from the static data file
 * This is the primary method to use instead of the old API-based getTools()
 */
export function getStaticTools(): ToolsApiData {
    if (!toolsCache) {
        const dataPath = getDataPath('tools.json');

        if (!fs.existsSync(dataPath)) {
            console.warn(
                'Static tools data not found. Run `npm run build-data` first.',
            );
            return {};
        }

        toolsCache = loadJSON<StaticToolsData>(dataPath);
    }

    return toolsCache.tools;
}

/**
 * Get build metadata
 */
export function getStaticToolsMeta(): BuildMeta | null {
    if (!toolsCache) {
        getStaticTools(); // This will populate the cache
    }
    return toolsCache?.meta || null;
}

/**
 * Get a single tool by ID
 */
export function getStaticTool(toolId: string): ApiTool | null {
    const tools = getStaticTools();
    return tools[toolId] || null;
}

/**
 * Get all tool IDs
 */
export function getStaticToolIds(): string[] {
    const tools = getStaticTools();
    return Object.keys(tools);
}

/**
 * Get static tags (languages and others)
 */
export function getStaticTags(): StaticTagsData {
    if (!tagsCache) {
        const dataPath = getDataPath('tags.json');

        if (!fs.existsSync(dataPath)) {
            console.warn(
                'Static tags data not found. Run `npm run build-data` first.',
            );
            return { languages: [], others: [] };
        }

        tagsCache = loadJSON<StaticTagsData>(dataPath);
    }

    return tagsCache;
}

/**
 * Get all unique languages from tools
 */
export function getStaticLanguages(): string[] {
    return getStaticTags().languages;
}

/**
 * Get all unique "other" tags from tools
 */
export function getStaticOthers(): string[] {
    return getStaticTags().others;
}

/**
 * Check if static data exists
 */
export function hasStaticData(): boolean {
    return fs.existsSync(getDataPath('tools.json'));
}

/**
 * Get tool stats (view counts)
 */
export function getStaticToolStats(): StatsApiData {
    if (!toolStatsCache) {
        const dataPath = getDataPath('tool-stats.json');

        if (!fs.existsSync(dataPath)) {
            console.warn(
                'Static tool stats not found. Run `npm run build-data` first.',
            );
            return {};
        }

        toolStatsCache = loadJSON<StatsApiData>(dataPath);
    }

    return toolStatsCache;
}

/**
 * Get tag stats (view counts)
 */
export function getStaticTagStats(): StatsApiData {
    if (!tagStatsCache) {
        const dataPath = getDataPath('tag-stats.json');

        if (!fs.existsSync(dataPath)) {
            console.warn(
                'Static tag stats not found. Run `npm run build-data` first.',
            );
            return {};
        }

        tagStatsCache = loadJSON<StatsApiData>(dataPath);
    }

    return tagStatsCache;
}

/**
 * Clear the cache (useful for testing or hot reloading)
 */
export function clearStaticDataCache(): void {
    toolsCache = null;
    tagsCache = null;
    toolStatsCache = null;
    tagStatsCache = null;
}
