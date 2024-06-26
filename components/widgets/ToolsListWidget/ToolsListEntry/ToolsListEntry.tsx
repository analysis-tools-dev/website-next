import { FC } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { type Tool } from '@components/tools';
import styles from './ToolsListEntry.module.css';
import VoteWidget from '../../VoteWidget/VoteWidget';

export interface ToolsListEntryProps {
    tool: Tool;
}

const ToolsListEntry: FC<ToolsListEntryProps> = ({ tool }) => {
    return (
        <div className={styles.listEntryWrapper}>
            <VoteWidget toolId={tool.id} type={'secondary'} />
            <Link
                passHref
                href={`/tool/${tool.id}`}
                className={cn(styles.toolLink, 'no-underline')}>
                <Image
                    src="/assets/icons/languages/multi-language.svg"
                    height="18"
                    width="18"
                    alt="MultiLanguage"
                />
                <span className={styles.toolName}>{tool.name}</span>
            </Link>
        </div>
    );
};

export default ToolsListEntry;
