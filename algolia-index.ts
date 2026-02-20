import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';
import fs from 'fs';
import path from 'path';

import { ApiTool } from 'utils/types';
import { Tool } from '@components/tools';

const algoliaClient: SearchClient = algoliasearch(
    process.env.ALGOLIA_APP_ID as string,
    process.env.ALGOLIA_ADMIN_KEY as string,
);

const index: SearchIndex = algoliaClient.initIndex(
    process.env.ALGOLIA_INDEX_NAME as string,
);

interface ToolsData {
    tools: Record<string, Tool>;
}

function loadToolsFromFile(): Tool[] {
    const toolsPath = path.join(__dirname, 'data', 'tools.json');

    if (!fs.existsSync(toolsPath)) {
        throw new Error(
            `Tools data file not found at ${toolsPath}. Run 'npm run prebuild' first.`,
        );
    }

    const fileContent = fs.readFileSync(toolsPath, 'utf-8');
    const toolsData: ToolsData = JSON.parse(fileContent);

    if (!toolsData.tools || Object.keys(toolsData.tools).length === 0) {
        throw new Error('No tools data found or empty object returned');
    }

    // Convert the tools object to an array with IDs
    const toolsArray = Object.entries(toolsData.tools).map(([id, tool]) => ({
        ...tool,
        id,
    }));

    return toolsArray;
}

async function updateIndex(data: ApiTool[]): Promise<void> {
    console.log(`Indexing ${data.length} ApiTool entries...`);

    try {
        const response = await index.clearObjects();
        console.log('Algolia index cleared', response);

        const algoliaResponse = await index.saveObjects(data);
        console.log('Algolia index updated', algoliaResponse);
    } catch (error) {
        console.error(
            'An error occurred while updating the Algolia index:',
            error,
        );
        throw error;
    }
}

function prepareDataForIndexing(toolsData: Tool[]): ApiTool[] {
    console.log(`Preparing ${toolsData.length} tools for indexing`);

    // Convert the tools data into an array of Algolia records
    const algoliaRecords = toolsData.map((tool) => ({
        objectID: tool.id, // Use the tool's ID as the objectID for Algolia
        name: tool.name,
        fields: {
            slug: `/tool/${tool.id}`,
        },
        categories: tool.categories,
        languages: tool.languages,
        licenses: tool.licenses,
        types: tool.types,
        homepage: tool.homepage,
        source: tool.source,
        pricing: tool.pricing,
        plans: tool.plans,
        description: tool.description,
        discussion: tool.discussion,
        deprecated: tool.deprecated,
        resources: tool.resources,
        wrapper: tool.wrapper,
        votes: tool.votes ?? 0,
        other: tool.other,
    }));

    return algoliaRecords;
}

async function main(): Promise<void> {
    try {
        console.log('Loading tools from static data file...');
        const toolsData = loadToolsFromFile();
        console.log(`Loaded ${toolsData.length} tools from data/tools.json`);

        const dataToIndex = prepareDataForIndexing(toolsData);
        await updateIndex(dataToIndex);

        console.log('Algolia indexing completed successfully!');
    } catch (error) {
        console.error('Failed to fetch or index data:', error);
        process.exit(1);
    }
}

main();
