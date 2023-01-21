import { FC, useEffect, useState } from 'react';
import { Dropdown, PanelHeader, SuggestLink } from '@components/elements';
import { Tool, ToolCard } from '@components/tools';

const pickSort = (sort: string) => {
    switch (sort) {
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

interface AlternateToolsListProps {
    tools: Tool[];
}

const SingleLanguageTools = ({
    singleTagTools,
}: {
    singleTagTools: Tool[];
}) => {
    return (
        (singleTagTools && (
            <div>
                {singleTagTools.map((tool, index) => (
                    <ToolCard key={index} tool={tool} />
                ))}
            </div>
        )) || <SuggestLink />
    );
};

const MultiLanguageTools = ({ multiTagTools }: { multiTagTools: Tool[] }) => {
    const multiTagHeading = `${multiTagTools.length} Multi-Language Tools`;
    return (
        (multiTagTools && (
            <>
                <PanelHeader level={3} text={multiTagHeading}></PanelHeader>
                <div>
                    {multiTagTools.map((tool, index) => (
                        <ToolCard key={index} tool={tool} />
                    ))}
                </div>
            </>
        )) || <SuggestLink />
    );
};

export const AlternateToolsList: FC<AlternateToolsListProps> = ({ tools }) => {
    const [sorting, setSorting] = useState('votes_desc');
    const [sortedTools, setSortedTools] = useState([...tools]);

    useEffect(() => {
        const sorted = tools.sort(pickSort(sorting || ''));
        setSortedTools([...sorted]);
    }, [sorting, tools]);

    const singleTagTools = sortedTools.filter(
        (tool) =>
            tool.languages.length === 1 ||
            (tool.languages.length === 0 && tool.other.length === 1),
    );
    // filter out all singleTagTools
    const multiTagTools = sortedTools.filter(
        (tool) => !singleTagTools.includes(tool),
    );

    const alternateToolsHeading = singleTagTools.length
        ? `${singleTagTools.length} Alternative Tools`
        : 'Alternative Tools';

    const changeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSorting(e.target.value);
    };

    return (
        <>
            <PanelHeader level={3} text={alternateToolsHeading}>
                <Dropdown changeSort={changeSort} />
            </PanelHeader>
            <SingleLanguageTools singleTagTools={singleTagTools} />
            <MultiLanguageTools multiTagTools={multiTagTools} />
        </>
    );
};
