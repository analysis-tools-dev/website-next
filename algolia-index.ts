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

                // Listen for data chunks
                res.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data) as Tool[];
                        resolve(parsedData);
                    } catch (e) {
                        reject(e);
                    }
                });
            })
            .on('error', (e) => {
                reject(e);
            });
    });
}

async function updateIndex(data: ApiTool[]): Promise<void> {
    try {
        await index.clearObjects();
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

        // Convert the tools data into an array of Algolia records
        const algoliaRecords: ApiTool[] = Object.entries(toolsData).map(
            ([key, value]) => ({
                objectID: key,
                name: value.name,
                fields: {
                    slug: `/tool/${value.id}`,
                },
                categories: value.categories,
                languages: value.languages,
                licenses: value.licenses,
                types: value.types,
                homepage: value.homepage,
                source: value.source,
                pricing: value.pricing,
                plans: value.plans,
                description: value.description,
                discussion: value.discussion,
                deprecated: value.deprecated,
                resources: value.resources,
                wrapper: value.wrapper,
                votes: value.votes,
                other: value.other,
            }),
        );

        return algoliaRecords;
    } catch (error) {
        console.error('Failed to fetch data for indexing:', error);
        return [];
    }
}

async function main(): Promise<void> {
    const dataToIndex = await fetchDataForIndexing();
    await updateIndex(dataToIndex);
}

main();
