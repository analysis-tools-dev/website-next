import { isToolsApiData, isVotesApiData } from 'utils/type-guards';
import { calculateUpvotePercentage } from 'utils/votes';
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

        const v = votes[key];
        const sum = v?.sum || 0;
        const upVotes = v?.upVotes || 0;
        const downVotes = v?.downVotes || 0;

        data[toolId].votes = sum;
        data[toolId].upVotes = upVotes;
        data[toolId].downVotes = downVotes;

        data[toolId].upvotePercentage = calculateUpvotePercentage(
            upVotes,
            downVotes,
        );
    });

    return data;
};
