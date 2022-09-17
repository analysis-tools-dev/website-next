import { FC } from 'react';
import { type Tool } from '@components/tools';
import { submitVote, votesFormatter } from 'utils/votes';
import cn from 'classnames';
import styles from './VoteWidget.module.css';
export interface VoteWidgetProps {
    tool: Tool;
    type?: 'primary' | 'secondary';
}

const VoteWidget: FC<VoteWidgetProps> = ({ tool, type = 'primary' }) => {
    const theme = type === 'primary' ? styles.primary : styles.secondary;

    const upVoteButtonClick = async () => {
        const result = await submitVote(tool.id, 1);

        console.log(result);
    };

    const downVoteButtonClick = async () => {
        const result = await submitVote(tool.id, -1);

        console.log(result);
    };

    return (
        <div className={cn(theme)}>
            <button
                className={styles.voteBtn}
                onClick={upVoteButtonClick}></button>
            <span className={styles.votes}>{votesFormatter(tool.votes)}</span>
            <button
                className={cn(styles.voteBtn, styles.downvoteBtn)}
                onClick={downVoteButtonClick}></button>
        </div>
    );
};

export default VoteWidget;
