/**
 * TagsRepository
 *
 * Repository class for accessing tags (languages and others) from static JSON files.
 * Data is pre-built at build time by scripts/build-data.ts.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ApiTag, LanguageData, TagsType } from 'utils/types';
import { isLanguageData } from 'utils/type-guards';

interface StaticTagsData {
    languages: string[];
    others: string[];
}

export class TagsRepository {
    private static instance: TagsRepository | null = null;
    private tagsData: StaticTagsData | null = null;
    private descriptionsData: Record<string, LanguageData> | null = null;
    private relatedTagsData: string[][] | null = null;

    private readonly tagsPath: string;
    private readonly descriptionsPath: string;
    private readonly relatedTagsPath: string;

    private constructor() {
        const dataDir = path.join(process.cwd(), 'data');
        this.tagsPath = path.join(dataDir, 'tags.json');
        this.descriptionsPath = path.join(dataDir, 'descriptions.json');
        this.relatedTagsPath = path.join(dataDir, 'relatedTags.json');
    }

    static getInstance(): TagsRepository {
        if (!TagsRepository.instance) {
            TagsRepository.instance = new TagsRepository();
        }
        return TagsRepository.instance;
    }

    private loadTags(): StaticTagsData {
        if (this.tagsData) {
            return this.tagsData;
        }

        if (!fs.existsSync(this.tagsPath)) {
            console.warn(
                'Static tags data not found. Run `npm run build-data` first.',
            );
            return { languages: [], others: [] };
        }

        const content = fs.readFileSync(this.tagsPath, 'utf-8');
        this.tagsData = JSON.parse(content) as StaticTagsData;
        return this.tagsData;
    }

    private loadDescriptions(): Record<string, LanguageData> {
        if (this.descriptionsData) {
            return this.descriptionsData;
        }

        if (!fs.existsSync(this.descriptionsPath)) {
            return {};
        }

        const content = fs.readFileSync(this.descriptionsPath, 'utf-8');
        this.descriptionsData = JSON.parse(content);
        return this.descriptionsData || {};
    }

    private loadRelatedTags(): string[][] {
        if (this.relatedTagsData) {
            return this.relatedTagsData;
        }

        if (!fs.existsSync(this.relatedTagsPath)) {
            return [];
        }

        const content = fs.readFileSync(this.relatedTagsPath, 'utf-8');
        this.relatedTagsData = JSON.parse(content) || [];
        return this.relatedTagsData || [];
    }

    private capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getAll(type: TagsType): ApiTag[] {
        const tags = this.loadTags();

        const languageTags: ApiTag[] = tags.languages.map((lang) => ({
            name: this.capitalizeFirstLetter(lang),
            value: lang,
            tag_type: 'languages',
        }));

        const otherTags: ApiTag[] = tags.others.map((other) => ({
            name: this.capitalizeFirstLetter(other),
            value: other,
            tag_type: 'other',
        }));

        switch (type) {
            case 'languages':
                return languageTags;
            case 'other':
                return otherTags;
            case 'all':
                return [...languageTags, ...otherTags];
            default:
                console.error(`Unknown tag type: ${type}`);
                return [];
        }
    }

    getLanguages(): string[] {
        return this.loadTags().languages;
    }

    getOthers(): string[] {
        return this.loadTags().others;
    }

    getById(type: TagsType, tagId: string): ApiTag | null {
        const tags = this.getAll(type);
        return (
            tags.find((t) => t.value.toLowerCase() === tagId.toLowerCase()) ||
            null
        );
    }

    getDescription(tagId: string): LanguageData {
        const defaultData: LanguageData = {
            name: this.capitalizeFirstLetter(tagId),
            website: '',
            description: '',
        };

        const descriptions = this.loadDescriptions();
        const data = descriptions[tagId];

        if (!data || !isLanguageData(data)) {
            return defaultData;
        }

        return data;
    }

    getRelated(tag: string): string[] {
        const relatedTags = this.loadRelatedTags();

        const relatedGroup = relatedTags.find((tags) =>
            tags.includes(tag.toLowerCase()),
        );

        if (!relatedGroup) {
            return [];
        }

        return relatedGroup.filter((t) => t !== tag.toLowerCase());
    }

    clearCache(): void {
        this.tagsData = null;
        this.descriptionsData = null;
        this.relatedTagsData = null;
    }
}
