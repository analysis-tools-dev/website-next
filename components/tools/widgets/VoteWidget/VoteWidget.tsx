import { FC } from 'react';
import { type Tool } from '@components/tools/types';
import { votesFormatter } from '@components/tools/utils';
import styles from './VoteWidget.module.css';

export interface VoteWidgetProps {
    tool: Tool;
}

const VoteWidget: FC<VoteWidgetProps> = ({ tool }) => {
    return (
        <div className={styles.voteWrapper}>
            <button className={styles.upvoteBtn}></button>
            <span className={styles.votes}>{votesFormatter(tool.votes)}</span>
            <button className={styles.downvoteBtn}></button>
        </div>
    );
};

export default VoteWidget;
