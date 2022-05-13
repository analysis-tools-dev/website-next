import { FC } from 'react';
import Link from 'next/link';
import { LinkButton, LoadingCogs, PanelHeader } from '@components/elements';
import { LanguageTopToolsWidget } from '@components/widgets';
import styles from './PopularToolsByLanguage.module.css';

import { usePopularLanguagesQuery } from '../queries';

interface PopularToolsByLanguageProps {
    limit?: number;
}

const PopularToolsByLanguage: FC<PopularToolsByLanguageProps> = ({
    limit = 5,
}) => {
    const toolsByTopLanguages = usePopularLanguagesQuery();

    if (
        toolsByTopLanguages.isLoading ||
        toolsByTopLanguages.isFetching ||
        toolsByTopLanguages.isRefetching
    ) {
        return <LoadingCogs />;
    }
    if (toolsByTopLanguages.error || !toolsByTopLanguages.data) {
        return null;
    }

    const languages = Object.keys(toolsByTopLanguages.data);
    const tools = toolsByTopLanguages.data;
    return (
        <>
            <PanelHeader
                level={2}
                text="Popular Static Analysis Tools by Language">
                {languages.length > limit ? (
                    <Link href="/languages">
                        {`Show all (${languages.length})`}
                    </Link>
                ) : null}
            </PanelHeader>

            {languages.slice(0, limit).map((language, index) => (
                <LanguageTopToolsWidget
                    key={index}
                    language={language}
                    formatters={tools[language]?.formatters || []}
                    linters={tools[language]?.linters || []}
                />
            ))}

            <LinkButton
                href="/tools"
                label="Find more tools"
                className={styles.moreBtn}
            />
        </>
    );
};

export default PopularToolsByLanguage;
