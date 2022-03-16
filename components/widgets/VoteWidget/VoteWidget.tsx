import { FC } from 'react';
import { type Tool } from '@components/tools';
import { votesFormatter } from 'utils';
import cn from 'classnames';
import styles from './VoteWidget.module.css';
export interface VoteWidgetProps {
    tool: Tool;
    type?: 'primary' | 'secondary';
}

const VoteWidget: FC<VoteWidgetProps> = ({ tool, type = 'primary' }) => {
    const theme = type === 'primary' ? styles.primary : styles.secondary;
    return (
        <div className={cn(theme)}>
            <button className={styles.voteBtn}></button>
            <span className={styles.votes}>{votesFormatter(tool.votes)}</span>
            <button className={cn(styles.voteBtn, styles.downvoteBtn)}></button>
        </div>
    );
};

export default VoteWidget;
