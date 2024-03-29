import { FC, useEffect, useState } from 'react';
import { Dropdown, PanelHeader, SuggestLink } from '@components/elements';
import { Tool, ToolCard } from '@components/tools';
import { arrayDelete, arraysEqual } from 'utils/arrays';
import { sortByPopularity } from 'utils/votes';
import { AffiliatesData } from 'utils/types';
import { AffiliateCard } from '@components/affiliates';

const pickSort = (sort: string) => {
    switch (sort) {
        case 'most_popular':
            return (a: Tool, b: Tool) => sortByPopularity(a, b);
        case 'least_popular':
            return (a: Tool, b: Tool) => sortByPopularity(b, a);
        case 'votes_asc':
            return (a: Tool, b: Tool) => a.votes - b.votes;
        case 'alphabetical_asc':
            return (a: Tool, b: Tool) => a.name.localeCompare(b.name);
        case 'alphabetical_desc':
            return (a: Tool, b: Tool) => b.name.localeCompare(a.name);
        default:
            return (a: Tool, b: Tool) => b.votes - a.votes;
    }
};

interface AlternativeToolsListProps {
    listTitle: string;
    currentTool?: Tool;
    tools: Tool[];
    affiliate?: AffiliatesData;
}

const SingleLanguageTools = ({
    affiliate,
    singleTagTools,
}: {
    affiliate?: AffiliatesData;
    singleTagTools: Tool[];
}) => {
    return (
        <>
            <div>
                {affiliate && <AffiliateCard affiliate={affiliate} />}
                {singleTagTools.map((tool, index) => (
                    <ToolCard key={index} tool={tool} />
                ))}
            </div>
            {singleTagTools.length === 0 && <SuggestLink />}
        </>
    );
};

const MultiLanguageTools = ({ multiTagTools }: { multiTagTools: Tool[] }) => {
    const multiTagHeading = `${multiTagTools.length} Multi-Language Tools`;
    return (
        <>
            {multiTagTools.length > 0 && (
                <>
                    <PanelHeader level={3} text={multiTagHeading}></PanelHeader>
                    <div>
                        {multiTagTools.map((tool, index) => (
                            <ToolCard key={index} tool={tool} />
                        ))}
                    </div>
                </>
            )}
            <SuggestLink />
        </>
    );
};

// Clean up the languages, so that e.g. "C" and "C++" are in the same category
const reduceLangs = (originalLanguages: string[]) => {
    // Create a copy of the array
    const languages = [...originalLanguages];

    // If the array contains "C", remove "C++"
    if (languages.includes('c')) {
        arrayDelete(languages, 'cpp');
    }
    if (languages.includes('csharp')) {
        arrayDelete(languages, 'aspnet');
    }

    // If the array contains "TypeScript", remove "JavaScript"
    if (languages.includes('typescript')) {
        arrayDelete(languages, 'javascript');
        arrayDelete(languages, 'jsx');
        arrayDelete(languages, 'flow');
    }

    if (languages.includes('kotlin')) {
        arrayDelete(languages, 'java');
        arrayDelete(languages, 'groovy');
        arrayDelete(languages, 'scala');
        arrayDelete(languages, 'clojure');
    }

    return languages;
};

// Function, which returns true if the languages of tool are a subset of the
// languages of the alternative tool or if the tools are in the same "category"
// of languages, e.g. "C" and "C++" are in the same category or "TypeScript" and
// "JavaScript" are in the same category.
const sameLanguages = (tool: Tool, alternative: Tool) => {
    const toolLanguages = tool.languages || [];
    const alternativeLanguages = alternative.languages || [];

    return arraysEqual(
        reduceLangs(toolLanguages),
        reduceLangs(alternativeLanguages),
    );
};

export const AlternativeToolsList: FC<AlternativeToolsListProps> = ({
    listTitle,
    currentTool,
    tools,
    affiliate,
}) => {
    const [sorting, setSorting] = useState('votes_desc');
    const [sortedTools, setSortedTools] = useState([...tools]);

    useEffect(() => {
        const sorted = tools.sort(pickSort(sorting || ''));
        setSortedTools([...sorted]);
    }, [sorting, tools]);

    const singleTagTools = sortedTools.filter(
        (alt) =>
            (currentTool && sameLanguages(currentTool, alt)) ||
            alt.languages.length === 1 ||
            (alt.languages.length === 0 && alt.other.length === 1) ||
            currentTool?.languages === alt.languages,
    );
    // filter out all singleTagTools
    const multiTagTools = sortedTools.filter(
        (tool) => !singleTagTools.includes(tool),
    );

    const alternativeToolsHeading = singleTagTools.length
        ? `${singleTagTools.length} ${listTitle}`
        : listTitle;

    const changeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSorting(e.target.value);
    };

    return (
        <>
            {singleTagTools.length > 0 || affiliate ? (
                <>
                    <PanelHeader level={3} text={alternativeToolsHeading}>
                        <Dropdown changeSort={changeSort} />
                    </PanelHeader>
                    <SingleLanguageTools
                        singleTagTools={singleTagTools}
                        affiliate={affiliate}
                    />
                </>
            ) : (
                <SuggestLink />
            )}

            {multiTagTools && (
                <MultiLanguageTools multiTagTools={multiTagTools} />
            )}
        </>
    );
};
