/**
 * ToolsRepository
 *
 * Repository class for accessing tools data from static JSON files.
 * Data is pre-built at build time by scripts/build-data.ts.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ToolsApiData, ApiTool } from 'utils/types';
import type { Tool } from '@components/tools/types';

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
        })) as Tool[];
    }

    /**
     * Alias for toArray() - returns all tools as an array with IDs
     */
    getAllAsArray(): Tool[] {
        return this.toArray();
    }

    findWhere(predicate: (tool: ApiTool, id: string) => boolean): Tool[] {
        const tools = this.getAll();
        return Object.entries(tools)
            .filter(([id, tool]) => predicate(tool, id))
            .map(([id, tool]) => ({
                ...tool,
                id,
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

    clearCache(): void {
        this.toolsData = null;
    }
}
