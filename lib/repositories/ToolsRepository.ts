/**
 * ToolsRepository
 *
 * Repository class for accessing tools data from static JSON files.
 * Data is pre-built at build time by scripts/build-data.ts.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ToolsApiData, ApiTool, VotesApiData } from 'utils/types';
import type { Tool } from '@components/tools/types';
import { calculateUpvotePercentage } from 'utils/votes';

interface BuildMeta {
    buildTime: string;
    staticAnalysisCount: number;
    dynamicAnalysisCount: number;
    totalCount: number;
}

interface StaticToolsData {
    tools: ToolsApiData;
    meta: BuildMeta;
}

export class ToolsRepository {
    private static instance: ToolsRepository | null = null;
    private toolsData: StaticToolsData | null = null;
    private readonly dataPath: string;

    private constructor() {
        this.dataPath = path.join(process.cwd(), 'data', 'tools.json');
    }

    static getInstance(): ToolsRepository {
        if (!ToolsRepository.instance) {
            ToolsRepository.instance = new ToolsRepository();
        }
        return ToolsRepository.instance;
    }

    private loadData(): StaticToolsData {
        if (this.toolsData) {
            return this.toolsData;
        }

        if (!fs.existsSync(this.dataPath)) {
            console.warn(
                'Static tools data not found. Run `npm run build-data` first.',
            );
            return { tools: {}, meta: {} as BuildMeta };
        }

        const content = fs.readFileSync(this.dataPath, 'utf-8');
        this.toolsData = JSON.parse(content) as StaticToolsData;
        return this.toolsData;
    }

    getAll(): ToolsApiData {
        return this.loadData().tools;
    }

    getMeta(): BuildMeta | null {
        return this.loadData().meta || null;
    }

    getById(toolId: string): Tool | null {
        const tools = this.getAll();
        const tool = tools[toolId];

        if (!tool) {
            return null;
        }

        return {
            ...tool,
            id: toolId,
            votes: tool.votes || 0,
        } as Tool;
    }

    getAllIds(): string[] {
        return Object.keys(this.getAll());
    }

    toArray(): Tool[] {
        const tools = this.getAll();
        return Object.entries(tools).map(([id, tool]) => ({
            ...tool,
            id,
            votes: tool.votes || 0,
        })) as Tool[];
    }

    findWhere(predicate: (tool: ApiTool, id: string) => boolean): Tool[] {
        const tools = this.getAll();
        return Object.entries(tools)
            .filter(([id, tool]) => predicate(tool, id))
            .map(([id, tool]) => ({
                ...tool,
                id,
                votes: tool.votes || 0,
            })) as Tool[];
    }

    findByLanguage(language: string): Tool[] {
        return this.findWhere((tool) =>
            tool.languages.includes(language.toLowerCase()),
        );
    }

    findByCategory(category: string): Tool[] {
        return this.findWhere((tool) =>
            tool.categories.includes(category.toLowerCase()),
        );
    }

    findByType(type: string): Tool[] {
        return this.findWhere((tool) =>
            tool.types.includes(type.toLowerCase()),
        );
    }

    findByTag(tag: string): Tool[] {
        return this.findWhere(
            (tool) => tool.languages.includes(tag) || tool.other.includes(tag),
        );
    }

    count(): number {
        return Object.keys(this.getAll()).length;
    }

    getIcon(toolId: string): string | null {
        const iconPath = path.join(
            process.cwd(),
            'public',
            'assets',
            'images',
            'tools',
            `${toolId}.png`,
        );

        if (fs.existsSync(iconPath)) {
            return `/assets/images/tools/${toolId}.png`;
        }
        return null;
    }

    withVotes(votes: VotesApiData | null): ToolsApiData {
        const tools = this.getAll();

        if (!votes) {
            return tools;
        }

        const result: ToolsApiData = {};

        for (const [toolId, tool] of Object.entries(tools)) {
            const key = `toolsyaml${toolId}`;
            const v = votes[key];

            const sum = v?.sum || 0;
            const upVotes = v?.upVotes || 0;
            const downVotes = v?.downVotes || 0;

            result[toolId] = {
                ...tool,
                votes: sum,
                upVotes,
                downVotes,
                upvotePercentage: calculateUpvotePercentage(upVotes, downVotes),
            };
        }

        return result;
    }

    withVotesAsArray(votes: VotesApiData | null): Tool[] {
        const tools = this.withVotes(votes);
        return Object.entries(tools).map(([id, tool]) => ({
            ...tool,
            id,
            votes: tool.votes || 0,
        })) as Tool[];
    }

    clearCache(): void {
        this.toolsData = null;
    }
}
