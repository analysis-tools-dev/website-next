import { isToolsApiData, isVotesApiData } from 'utils/type-guards';
import { getAllTools } from './tools';
import { getVotes } from './votes';

export const getToolsWithVotes = async () => {
    const data = await getAllTools();
    const votes = await getVotes();

    if (!isToolsApiData(data) || !isVotesApiData(votes)) {
        console.error('Error loading tools with votes data');
        return null;
    }

    Object.keys(data).forEach((toolId) => {
        const key = `toolsyaml${toolId.toString()}`;
        data[toolId].votes = votes[key]?.sum || 0;
        data[toolId].upVotes = votes[key]?.upVotes || 0;
        data[toolId].downVotes = votes[key]?.downVotes || 0;
    });

    return data;
};
