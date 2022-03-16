import { FC } from 'react';
import Link from 'next/link';
import { LinkButton, PanelHeader } from '@components/elements';
import { LanguageTopToolsWidget } from '@components/widgets';
import styles from './PopularToolsByLanguage.module.css';

import topToolsByLanguage from '../../../data/topToolsByLanguage.json';

interface PopularToolsByLanguageProps {
    limit?: number;
}

const PopularToolsByLanguage: FC<PopularToolsByLanguageProps> = ({
    limit = 5,
}) => {
    return (
        <>
            <PanelHeader
                level={2}
                text="Popular Static Analysis Tools by Language">
                {topToolsByLanguage.length > limit ? (
                    <Link href="/languages">
                        {`Show all (${topToolsByLanguage.length})`}
                    </Link>
                ) : null}
            </PanelHeader>

            {topToolsByLanguage.slice(0, limit).map((entry, index) => (
                <LanguageTopToolsWidget
                    key={index}
                    language={entry.language}
                    formatters={entry.topFormatters}
                    linters={entry.topLinters}
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
