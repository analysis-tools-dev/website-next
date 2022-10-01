import { FC } from 'react';
import { submitVote, votesFormatter } from 'utils/votes';
import cn from 'classnames';
import styles from './VoteWidget.module.css';
import { LoadingDots } from '@components/elements';
import { useToolVotesQuery } from './query';
export interface VoteWidgetProps {
    toolId: string;
    type?: 'primary' | 'secondary';
}

const VoteWidget: FC<VoteWidgetProps> = ({ toolId, type = 'primary' }) => {
    const theme = type === 'primary' ? styles.primary : styles.secondary;

    const { data, isLoading, isFetching, isRefetching, error, refetch } =
        useToolVotesQuery(toolId);

    if (isLoading || isFetching || isRefetching) {
        return (
            <div className={cn(theme)}>
                <LoadingDots />
            </div>
        );
    }
    if (error || !data) {
        return null;
    }

    const votes = votesFormatter(data.votes || 0);

    const upVoteButtonClick = async () => {
        const result = await submitVote(toolId, 1);

        // TODO: Handle error
        console.log(result);
        refetch(); // FIXME: There is a delay until the vote recalculcation is triggered server side
    };

    const downVoteButtonClick = async () => {
        const result = await submitVote(toolId, -1);

        // TODO: Handle error
        console.log(result);
        refetch(); // FIXME: There is a delay until the vote recalculcation is triggered server side
    };

    return (
        <div className={cn(theme)}>
            <button
                className={styles.voteBtn}
                onClick={upVoteButtonClick}></button>
            <span className={styles.votes}>{votes}</span>
            <button
                className={cn(styles.voteBtn, styles.downvoteBtn)}
                onClick={downVoteButtonClick}></button>
        </div>
    );
};

export default VoteWidget;
