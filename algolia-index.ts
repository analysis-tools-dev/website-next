import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';

import { ApiTool } from 'utils/types';
import { Tool } from '@components/tools';
import https from 'https';

const algoliaClient: SearchClient = algoliasearch(
    process.env.ALGOLIA_APP_ID as string,
    process.env.ALGOLIA_ADMIN_KEY as string,
);

const index: SearchIndex = algoliaClient.initIndex(
    process.env.ALGOLIA_INDEX_NAME as string,
);

async function fetchToolsFromApi(): Promise<Tool[]> {
    return new Promise((resolve, reject) => {
        const apiURL = 'https://analysis-tools.dev/api/tools';
        https
            .get(apiURL, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const jsonResponse = JSON.parse(data);
                        if (
                            !jsonResponse.data ||
                            jsonResponse.data.length === 0
                        ) {
                            reject(
                                new Error(
                                    'No tools data found or empty array returned',
                                ),
                            );
                        } else {
                            resolve(jsonResponse.data);
                        }
                    } catch (e) {
                        reject(new Error('Failed to parse tools data'));
                    }
                });
            })
            .on('error', (e) => {
                reject(new Error('Failed to fetch tools data'));
            });
    });
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
    }
}

async function fetchDataForIndexing(): Promise<ApiTool[]> {
    try {
        const toolsData = await fetchToolsFromApi();
        console.log(`Fetched ${toolsData.length} tools from the API`);

        // Convert the tools data into an array of Algolia records
        const algoliaRecords = toolsData.map((tool, _index) => ({
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
            votes: tool.votes,
            other: tool.other,
        }));

        return algoliaRecords;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function main(): Promise<void> {
    try {
        const dataToIndex = await fetchDataForIndexing();
        await updateIndex(dataToIndex);
    } catch (error) {
        console.error('Failed to fetch or index data:', error);
        process.exit(1);
    }
}

main();
