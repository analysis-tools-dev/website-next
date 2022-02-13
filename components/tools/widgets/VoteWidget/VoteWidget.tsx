import { FC } from 'react';
import { type Tool } from '../../types';
import styles from './VoteWidget.module.css';

export interface VoteWidgetProps {
    tool: Tool;
}

const kFormatter = (num: number) => {
    return Math.abs(num) > 999
        ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + 'K'
        : Math.sign(num) * Math.abs(num);
};

const VoteWidget: FC<VoteWidgetProps> = ({ tool }) => {
    return (
        <div className={styles.voteWrapper}>
            <button className={styles.upvoteBtn}></button>
            <span className={styles.votes}>{kFormatter(tool.votes)}</span>
            <button className={styles.downvoteBtn}></button>
        </div>
    );
};

export default VoteWidget;
