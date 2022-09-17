import { FC, useState } from 'react';
import { type Tool } from '@components/tools';
import { submitVote, votesFormatter } from 'utils/votes';
import cn from 'classnames';
import styles from './VoteWidget.module.css';
import { LoadingDots } from '@components/elements';
export interface VoteWidgetProps {
    tool: Tool;
    type?: 'primary' | 'secondary';
}

const VoteWidget: FC<VoteWidgetProps> = ({ tool, type = 'primary' }) => {
    const [loading, setLoading] = useState(false);
    const theme = type === 'primary' ? styles.primary : styles.secondary;

    const upVoteButtonClick = async () => {
        setLoading(true);
        const result = await submitVote(tool.id, 1);

        // TODO: Handle error
        console.log(result);
        setLoading(false);
        // TODO: Reload Data without refreshing the page
    };

    const downVoteButtonClick = async () => {
        setLoading(true);
        const result = await submitVote(tool.id, -1);

        // TODO: Handle error
        console.log(result);
        setLoading(false);
        // TODO: Reload Data without refreshing the page
    };

    return (
        <div className={cn(theme)}>
            <button
                className={styles.voteBtn}
                onClick={upVoteButtonClick}></button>
            {loading ? (
                <LoadingDots className={styles.loading} />
            ) : (
                <span className={styles.votes}>
                    {votesFormatter(tool.votes)}
                </span>
            )}
            <button
                className={cn(styles.voteBtn, styles.downvoteBtn)}
                onClick={downVoteButtonClick}></button>
        </div>
    );
};

export default VoteWidget;
