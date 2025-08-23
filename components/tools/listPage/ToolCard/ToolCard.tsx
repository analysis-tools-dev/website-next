import { FC, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import { type Tool } from '@components/tools/types';
import Image from 'next/image';

import styles from './ToolCard.module.css';
import { TagList } from '@components/elements';
import { VoteWidget } from '@components/widgets';
import { deCamelString } from 'utils/strings';
import { isSponsor } from 'utils/sponsor';
import router from 'next/router';

export interface ToolCardProps {
    tool: Tool;
}

const CLICKOUT_CLASSES = [
    styles.info,
    styles.toolMeta,
    styles.descriptionWrapper,
];

const ToolCard: FC<ToolCardProps> = ({ tool }) => {
    const votesRef = useRef(null);

    const isSingleLanguage = tool.languages.length === 1;

    const toolStatus = tool.deprecated ? 'Deprecated' : 'Maintained';
    const toolLanguage = isSingleLanguage
        ? deCamelString(tool.languages[0])
        : 'Multi-Language';

    // Route to tool page
    const handleElementClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Check element click by class name
        const target = e.target as HTMLElement;
        if (CLICKOUT_CLASSES.includes(target.className)) {
            e.stopPropagation();
            router.push(`/tool/${tool.id}`);
            return;
        }
    };

    // FIXME: Get language tag from name to work as href, some languages have different names than their tag
    return (
        <Card className={styles.toolCardWrapper}>
            <div className={styles.votes} ref={votesRef}>
                <VoteWidget toolId={tool.id} />
                <Link
                    passHref={true}
                    className={styles.clickOut}
                    href={`/tool/${tool.id}`}>
                    <div className={styles.clickOut} />
                </Link>
            </div>
            <div className={styles.info} onClick={handleElementClick}>
                <Link
                    passHref
                    href={`/tool/${tool.id}`}
                    className={styles.toolLink}>
                    <Heading level={3} className={styles.toolName}>
                        {tool.name}
                    </Heading>
                    {isSponsor(tool.id) && (
                        <Image
                            className={styles.sponsorLogo}
                            height="18"
                            width="18"
                            src="/assets/icons/general/sponsor.svg"
                            alt="Sponsor"
                        />
                    )}
                </Link>

                <div className={styles.descriptionWrapper}>
                    <ReactMarkdown className={styles.description}>
                        {tool.description || ''}
                    </ReactMarkdown>
                </div>

                <TagList languageTags={tool.languages} otherTags={tool.other} />

                <ul className={styles.toolMeta}>
                    <li>
                        <Image
                            key={`status-${tool.id}`}
                            height="13"
                            width="13"
                            src={`/assets/icons/general/${toolStatus.toLowerCase()}.svg`}
                            alt={toolStatus}
                        />
                        <span className={styles.metaInfo}>{toolStatus}</span>
                    </li>
                    <li>
                        <Image
                            key={`language-${tool.id}`}
                            height="15"
                            width="15"
                            src={`/assets/icons/languages/${toolLanguage.toLowerCase()}.svg`}
                            alt={toolStatus}
                        />
                        {isSingleLanguage ? (
                            <Link
                                href={`/tag/${toolLanguage.toLowerCase()}`}
                                className={styles.languageLink}>
                                {toolLanguage}
                            </Link>
                        ) : (
                            <span className={styles.metaInfo}>
                                {toolLanguage}
                            </span>
                        )}
                    </li>
                    <li>
                        {tool.types.map((type, index) => (
                            <span
                                key={`type-${index}`}
                                className={styles.toolType}>
                                <Image
                                    height="14"
                                    width="14"
                                    src={`/assets/icons/types/${type}.svg`}
                                    alt={toolStatus}
                                />
                                <span className={styles.metaInfo}>{type}</span>
                            </span>
                        ))}
                    </li>
                    <li>
                        {tool.categories.map((category, index) => (
                            <span
                                key={`category-${index}`}
                                className={styles.category}>
                                <Image
                                    height="14"
                                    width="14"
                                    src={`/assets/icons/category/${category}.svg`}
                                    alt={toolStatus}
                                />
                                <span className={styles.metaInfo}>
                                    {category}
                                </span>
                            </span>
                        ))}
                    </li>
                    {tool.upvotePercentage !== undefined && (
                        <li>
                            <span className={styles.metaInfo}>
                                {tool.upvotePercentage}% upvoted
                            </span>
                        </li>
                    )}
                </ul>
            </div>
        </Card>
    );
};

export default ToolCard;
