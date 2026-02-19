import { FC } from 'react';
import Link from 'next/link';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import { ToolsListWidget } from '@components/widgets';
import { type Tool } from '@components/tools/types';
import styles from './LanguageTopToolsWidget.module.css';
import { ImageWithFallback } from '@components/elements/ImageWithFallback';

export interface LanguageTopToolsWidgetProps {
    language: string;
    formatters: Tool[];
    linters: Tool[];
}
const LanguageTopToolsWidget: FC<LanguageTopToolsWidgetProps> = ({
    language,
    formatters,
    linters,
}) => {
    const href = `/tag/${language}`;
    const logo = `/assets/icons/languages/${language}.svg`;

    return (
        <Card className={styles.languageCardWrapper}>
            <Link href={href} className={styles.languageLink}>
                <ImageWithFallback
                    height="50"
                    width="50"
                    src={logo}
                    fallbackSrc="/assets/icons/languages/multi-language.svg"
                    alt={language}
                />
                <Heading level={2} className={styles.languageName}>
                    {language} static analysis tools
                </Heading>
            </Link>

            <div className={styles.toolListWrapper}>
                <ToolsListWidget
                    title={`Most popular ${language} Linters`}
                    href="/tools"
                    tools={linters}
                />

                <ToolsListWidget
                    title={`Most popular ${language} Formatters`}
                    href="/tools"
                    tools={formatters}
                />
            </div>
        </Card>
    );
};

export default LanguageTopToolsWidget;
