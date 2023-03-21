import { sortByVote } from 'utils/votes';
import { isSingleLanguageTool } from './filters';
import { getToolsWithVotes } from './toolsWithVotes';
import { getLanguageStats } from './toolStats';

export const getPopularLanguageStats = async () => {
    const data = await getToolsWithVotes();
    const languageStats = await getLanguageStats();

    if (!data || !languageStats) {
        console.error('Error loading popular language tools');
        return null;
    }

    Object.keys(data).forEach((toolId) => {
        const tool = data[toolId];
        if (isSingleLanguageTool(tool)) {
            const language = tool.languages[0];
            if (languageStats[language]) {
                const toolObj = {
                    id: toolId,
                    ...tool,
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

    // Filter out languages with no tools
    Object.keys(languageStats).forEach((language) => {
        if (
            languageStats[language].formatters.length === 0 &&
            languageStats[language].linters.length === 0
        ) {
            delete languageStats[language];
        }
    });

    return languageStats;
};
