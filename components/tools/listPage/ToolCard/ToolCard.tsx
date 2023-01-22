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
import { useIntersection } from 'hooks';

export interface ToolCardProps {
    tool: Tool;
}

const ToolCard: FC<ToolCardProps> = ({ tool }) => {
    const votesRef = useRef(null);
    const isVotesInViewport = useIntersection(votesRef);

    const isSingleLanguage = tool.languages.length === 1;

    const toolStatus = tool.deprecated ? 'Deprecated' : 'Maintained';
    const toolLanguage = isSingleLanguage
        ? deCamelString(tool.languages[0])
        : 'Multi-Language';

    // FIXME: Get language tag from name to work as href, some languages have different names then their tag
    return (
        <Card className={styles.toolCardWrapper}>
            <div className={styles.votes} ref={votesRef}>
                {isVotesInViewport && <VoteWidget toolId={tool.id} />}
            </div>
            <div className={styles.info}>
                <Link href={`/tool/${tool.id}`}>
                    <a className={styles.toolLink}>
                        <Heading level={3} className={styles.toolName}>
                            {tool.name}
                        </Heading>
                    </a>
                </Link>
                {isSponsor(tool.id) && (
                    <Image
                        className={styles.sponsorLogo}
                        height="20px"
                        width="20px"
                        src="/assets/icons/general/sponsor.svg"
                        alt="Sponsor"
                    />
                )}

                <ReactMarkdown className={styles.description}>
                    {tool.description || ''}
                </ReactMarkdown>
                <TagList languageTags={tool.languages} otherTags={tool.other} />

                <ul className={styles.toolMeta}>
                    <li>
                        <Image
                            key={`status-${tool.id}`}
                            height="13px"
                            width="13px"
                            src={`/assets/icons/general/${toolStatus.toLowerCase()}.svg`}
                            alt={toolStatus}
                        />
                        <span className={styles.metaInfo}>{toolStatus}</span>
                    </li>

                    <li>
                        <Image
                            key={`language-${tool.id}`}
                            height="15px"
                            width="15px"
                            src={`/assets/icons/languages/${toolLanguage.toLowerCase()}.svg`}
                            alt={toolStatus}
                        />
                        {isSingleLanguage ? (
                            <Link href={`/tag/${toolLanguage.toLowerCase()}`}>
                                <a className={styles.languageLink}>
                                    {toolLanguage}
                                </a>
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
                                    height="14px"
                                    width="14px"
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
                                    height="14px"
                                    width="14px"
                                    src={`/assets/icons/category/${category}.svg`}
                                    alt={toolStatus}
                                />
                                <span className={styles.metaInfo}>
                                    {category}
                                </span>
                            </span>
                        ))}
                    </li>
                </ul>
            </div>
        </Card>
    );
};

export default ToolCard;
