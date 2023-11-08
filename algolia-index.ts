import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';
import { getAllTools } from 'utils-api/tools';
import { ApiTool } from 'utils/types';

const algoliaClient: SearchClient = algoliasearch(
    process.env.ALGOLIA_APP_ID as string,
    process.env.ALGOLIA_ADMIN_KEY as string,
);

const index: SearchIndex = algoliaClient.initIndex(
    process.env.ALGOLIA_INDEX_NAME as string,
);

async function updateIndex(data: ApiTool[]): Promise<void> {
    try {
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
        const toolsData = await getAllTools();

        // Convert the tools data into an array of Algolia records
        const algoliaRecords: ApiTool[] = Object.entries(toolsData).map(
            ([key, value]) => ({
                objectID: key,
                name: value.name,
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
