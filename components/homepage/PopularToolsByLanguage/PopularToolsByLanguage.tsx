import { FC } from 'react';
import Link from 'next/link';
import { LinkButton, PanelHeader } from '@components/elements';
import { LanguageTopToolsWidget } from '@components/widgets';
import styles from './PopularToolsByLanguage.module.css';
import { ToolsByLanguage } from '@components/tools';

interface PopularToolsByLanguageProps {
    toolsByLangauge: ToolsByLanguage;
    limit?: number;
}

const PopularToolsByLanguage: FC<PopularToolsByLanguageProps> = ({
    toolsByLangauge,
    limit = 5,
}) => {
    const languages = Object.keys(toolsByLangauge);
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
                    formatters={toolsByLangauge[language]?.formatters || []}
                    linters={toolsByLangauge[language]?.linters || []}
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
