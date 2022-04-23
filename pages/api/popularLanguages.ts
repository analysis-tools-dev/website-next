import type { NextApiRequest, NextApiResponse } from 'next';
import { type ToolsByLanguage } from '@components/tools/types';
import { getLanguageStats } from 'utils-api/toolStats';
import { getTools } from 'utils-api/tools';
import { getVotes } from 'utils-api/votes';
import { sortByVote } from 'utils/votes';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ToolsByLanguage | { error: string }>,
) {
    const data = await getTools();
    const languageStats = await getLanguageStats();
    if (!data || !languageStats) {
        res.status(500).json({
            error: 'Failed to load popular languages data',
        });
        return res;
    }
    const votes = await getVotes();

    Object.keys(data).forEach((toolId) => {
        const tool = data[toolId];
        Object.keys(languageStats).forEach((language) => {
            if (tool.languages.includes(language)) {
                const voteKey = `toolsyaml${toolId.toString()}`;
                const voteData = votes[voteKey]?.sum || 0;

                languageStats[language].tools.push({
                    id: toolId,
                    ...tool,
                    votes: voteData,
                });

                languageStats[language].tools.sort(sortByVote);
                if (languageStats[language].tools.length > 3) {
                    languageStats[language].tools.pop();
                }
            }
        });
    });
    res.status(200).json(languageStats);
}
