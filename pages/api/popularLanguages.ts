import type { NextApiRequest, NextApiResponse } from 'next';
import { type ToolsByLanguage } from '@components/tools/types';
import { getLanguageStats } from 'utils-api/toolStats';
import { getTools } from 'utils-api/tools';
import { getVotes } from 'utils-api/votes';
import { sortByVote } from 'utils/votes';
import { isSingleLanguageTool } from 'utils-api/filters';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ToolsByLanguage | { error: string }>,
) {
    const data = await getTools();
    const languageStats = await getLanguageStats();
    const votes = await getVotes();
    if (!data || !languageStats || !votes) {
        res.status(500).json({
            error: 'Failed to load popular languages data',
        });
        return res;
    }

    Object.keys(data).forEach((toolId) => {
        const tool = data[toolId];
        if (isSingleLanguageTool(tool)) {
            const language = tool.languages[0];
            if (languageStats[language]) {
                const voteKey = `toolsyaml${toolId.toString()}`;
                const voteData = votes[voteKey]?.sum || 0;
                const toolObj = {
                    id: toolId,
                    ...tool,
                    votes: voteData,
                };

                if (tool.categories.includes('formatter')) {
                    languageStats[language].formatters.push(toolObj);
                }
                if (tool.categories.includes('linter')) {
                    languageStats[language].linters.push(toolObj);
                }

                // Sort by votes after pushing tools
                languageStats[language].formatters.sort(sortByVote);
                languageStats[language].linters.sort(sortByVote);

                // Keep top 3
                if (languageStats[language].formatters.length > 3) {
                    languageStats[language].formatters.pop();
                }
                if (languageStats[language].linters.length > 3) {
                    languageStats[language].linters.pop();
                }
            }
        }
    });
    res.status(200).json(languageStats);
}
