/**
 * StatsRepository
 *
 * Repository class for accessing tool and tag statistics from static JSON files.
 * Data is pre-built at build time by scripts/build-data.ts.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { StatsApiData } from 'utils/types';
import type { Tool, ToolsByLanguage } from '@components/tools/types';
import { ToolsRepository } from './ToolsRepository';
import { sortByVote } from 'utils/votes';

export class StatsRepository {
    private static instance: StatsRepository | null = null;
    private toolStatsData: StatsApiData | null = null;
    private tagStatsData: StatsApiData | null = null;

    private readonly toolStatsPath: string;
    private readonly tagStatsPath: string;

    private constructor() {
        const dataDir = path.join(process.cwd(), 'data');
        this.toolStatsPath = path.join(dataDir, 'tool-stats.json');
        this.tagStatsPath = path.join(dataDir, 'tag-stats.json');
    }

    static getInstance(): StatsRepository {
        if (!StatsRepository.instance) {
            StatsRepository.instance = new StatsRepository();
        }
        return StatsRepository.instance;
    }

    private loadToolStats(): StatsApiData {
        if (this.toolStatsData) {
            return this.toolStatsData;
        }

        if (!fs.existsSync(this.toolStatsPath)) {
            console.warn(
                'Static tool stats not found. Run `npm run build-data` first.',
            );
            return {};
        }

        const content = fs.readFileSync(this.toolStatsPath, 'utf-8');
        this.toolStatsData = JSON.parse(content) as StatsApiData;
        return this.toolStatsData;
    }

    private loadTagStats(): StatsApiData {
        if (this.tagStatsData) {
            return this.tagStatsData;
        }

        if (!fs.existsSync(this.tagStatsPath)) {
            console.warn(
                'Static tag stats not found. Run `npm run build-data` first.',
            );
            return {};
        }

        const content = fs.readFileSync(this.tagStatsPath, 'utf-8');
        this.tagStatsData = JSON.parse(content) as StatsApiData;
        return this.tagStatsData;
    }

    getToolStats(): StatsApiData {
        return this.loadToolStats();
    }

    getTagStats(): StatsApiData {
        return this.loadTagStats();
    }

    getToolViewCount(toolId: string): number {
        const stats = this.loadToolStats();
        return stats[toolId] || 0;
    }

    getTagViewCount(tag: string): number {
        const stats = this.loadTagStats();
        return stats[tag] || 0;
    }

    getLanguageStats(): ToolsByLanguage {
        const tagStats = this.loadTagStats();

        return Object.entries(tagStats)
            .sort(([, a], [, b]) => b - a)
            .reduce(
                (result, [key, value]) => ({
                    ...result,
                    [key]: {
                        views: value,
                        formatters: [],
                        linters: [],
                    },
                }),
                {} as ToolsByLanguage,
            );
    }

    getPopularLanguageStats(): ToolsByLanguage {
        const toolsRepo = ToolsRepository.getInstance();
        const tools = toolsRepo.getAll();
        const languageStats = this.getLanguageStats();

        for (const [toolId, tool] of Object.entries(tools)) {
            const isSingleLanguage = tool.languages.length <= 2;

            if (isSingleLanguage && tool.languages.length > 0) {
                const language = tool.languages[0];

                if (languageStats[language]) {
                    const toolObj: Tool = {
                        id: toolId,
                        ...tool,
                        votes: tool.votes || 0,
                    } as Tool;

                    if (tool.categories.includes('formatter')) {
                        languageStats[language].formatters.push(toolObj);
                    }
                    if (tool.categories.includes('linter')) {
                        languageStats[language].linters.push(toolObj);
                    }

                    languageStats[language].formatters.sort(sortByVote);
                    languageStats[language].linters.sort(sortByVote);

                    if (languageStats[language].formatters.length > 3) {
                        languageStats[language].formatters.pop();
                    }
                    if (languageStats[language].linters.length > 3) {
                        languageStats[language].linters.pop();
                    }
                }
            }
        }

        // Filter out languages with no tools
        for (const language of Object.keys(languageStats)) {
            if (
                languageStats[language].formatters.length === 0 &&
                languageStats[language].linters.length === 0
            ) {
                delete languageStats[language];
            }
        }

        return languageStats;
    }

    getMostViewedTools(): Tool[] {
        const toolsRepo = ToolsRepository.getInstance();
        const tools = toolsRepo.getAll();
        const toolStats = this.loadToolStats();

        const mostViewedToolIds = Object.keys(toolStats);

        return mostViewedToolIds
            .map((id) => {
                const tool = tools[id];
                if (!tool) {
                    return null;
                }

                return {
                    id,
                    ...tool,
                    votes: tool.votes || 0,
                    views: toolStats[id],
                } as Tool & { views: number };
            })
            .filter((tool): tool is Tool & { views: number } => tool !== null);
    }

    clearCache(): void {
        this.toolStatsData = null;
        this.tagStatsData = null;
    }
}
