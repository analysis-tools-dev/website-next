import { FC } from 'react';
import Link from 'next/link';
import { Card } from '@components/layout';
import { Heading, Text } from '@components/typography';
import { type Tool } from '@components/tools/types';
import Image from 'next/image';

import styles from './ToolCard.module.css';
import { TagList } from '@components/elements';
import { VoteWidget } from '@components/widgets';
import { deCamelString } from 'utils/strings';

export interface ToolCardProps {
    tool: Tool;
}

const ToolCard: FC<ToolCardProps> = ({ tool }) => {
    const toolStatus = tool.deprecated ? 'Deprecated' : 'Maintained';
    const toolLanguage =
        tool.languages.length === 1
            ? deCamelString(tool.languages[0])
            : 'Multi-Language';
    return (
        <Card className={styles.toolCardWrapper}>
            <div className={styles.votes}>
                <VoteWidget tool={tool} />
            </div>
            <div className={styles.info}>
                <Link href={`/tool/${tool.id}`}>
                    <a className={styles.toolLink}>
                        <Heading level={3} className={styles.toolName}>
                            {tool.name}
                        </Heading>
                    </a>
                </Link>
                <Text className={styles.description}>{tool.description}</Text>
                <TagList tags={tool.other} />

                <ul className={styles.toolMeta}>
                    <li>
                        <Image
                            height="13px"
                            width="13px"
                            src={`/assets/icons/general/${toolStatus.toLowerCase()}.svg`}
                            alt={toolStatus}
                        />
                        <span className={styles.metaInfo}>{toolStatus}</span>
                    </li>

                    <li>
                        <Image
                            height="15px"
                            width="15px"
                            src={`/assets/icons/languages/${toolLanguage.toLowerCase()}.svg`}
                            alt={toolStatus}
                        />
                        <span className={styles.metaInfo}>{toolLanguage}</span>
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
                </ul>
            </div>
        </Card>
    );
};

export default ToolCard;
