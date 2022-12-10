import { FC, useEffect } from 'react';
import { submitVote, votesFormatter } from 'utils/votes';
import cn from 'classnames';
import styles from './VoteWidget.module.css';
import { LoadingDots } from '@components/elements';
import { useToolVotesQuery } from './query';
import { isApiTag } from 'utils/type-guards';
export interface VoteWidgetProps {
    toolId: string;
    type?: 'primary' | 'secondary';
}

const VoteWidget: FC<VoteWidgetProps> = ({ toolId, type = 'primary' }) => {
    const theme = type === 'primary' ? styles.primary : styles.secondary;

    const { data, isLoading, isFetching, isRefetching, error, refetch } =
        useToolVotesQuery(toolId);

    let votesStr = votesFormatter(data?.votes || 0);
    let votes = data?.votes || 0;

    useEffect(() => {
        console.log('data', data);
        votesStr = votesFormatter(data?.votes || 0);
    }, [data, votes, votesStr]);

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

    const upVoteButtonClick = async () => {
        // Check local storage for vote
        const localVote = localStorage.getItem(`vote-${toolId}`);

        if (localVote) {
            // check if it was a downvote
            if (localVote === 'downvote') {
                votes += 2;
                // remove downvote and add upvote
                // await submitVote(toolId, 1);
                localStorage.setItem(`vote-${toolId}`, 'upvote');
            } else {
                // already upvoted. Do nothing
                return;
            }
        } else {
            // No vote in local storage. Add upvote
            // await submitVote(toolId, 1);
            votes += 1;
            localStorage.setItem(`vote-${toolId}`, 'upvote');
        }
    };

    const downVoteButtonClick = async () => {
        // Check local storage for vote
        const localVote = localStorage.getItem(`vote-${toolId}`);

        if (localVote) {
            // check if we have an upvote
            if (localVote === 'upvote') {
                votes -= 2;
                // remove upvote and add downvote
                // await submitVote(toolId, -1);
                localStorage.setItem(`vote-${toolId}`, 'downvote');
            } else {
                // already downvoted. Do nothing
                return;
            }
        } else {
            // No vote in local storage. Add downvote
            // await submitVote(toolId, -1);
            votes -= 1;
            localStorage.setItem(`vote-${toolId}`, 'downvote');
        }
    };

    return (
        <div className={cn(theme)}>
            <button
                className={styles.voteBtn}
                onClick={upVoteButtonClick}></button>
            <span className={styles.votes}>{votesStr}</span>
            <button
                className={cn(styles.voteBtn, styles.downvoteBtn)}
                onClick={downVoteButtonClick}></button>
        </div>
    );
};

export default VoteWidget;
