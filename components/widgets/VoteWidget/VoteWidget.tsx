import { FC, useEffect, useState } from 'react';
import { submitVote, votesFormatter } from 'utils/votes';
import cn from 'classnames';
import styles from './VoteWidget.module.css';
import { LoadingDots } from '@components/elements';
import { useToolVotesQuery } from './query';
import classNames from 'classnames';
export interface VoteWidgetProps {
    toolId: string;
    type?: 'primary' | 'secondary';
    showPercentage?: boolean;
}

const VoteWidget: FC<VoteWidgetProps> = ({
    toolId,
    type = 'primary',
    showPercentage,
}) => {
    const theme = type === 'primary' ? styles.primary : styles.secondary;
    const [votes, setVotes] = useState(0);
    const [voteAction, setVoteAction] = useState('');

    const { data, isLoading, isFetching, isRefetching, error } =
        useToolVotesQuery(toolId);

    useEffect(() => {
        // Check local storage for vote
        const localVote = localStorage.getItem(`vote-${toolId}`);

        if (data?.votes) {
            setVotes(data?.votes || 0);
        }
        if (localVote) {
            setVoteAction(localVote);
        }
    }, [data, toolId]);

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
                // voteData += 2;
                setVotes((prevVotes) => prevVotes + 2);
                await submitVote(toolId, 1);
                localStorage.setItem(`vote-${toolId}`, 'upvote');
                setVoteAction('upvote');
            }
        } else {
            // No vote in local storage. Add upvote
            await submitVote(toolId, 1);
            setVotes((prevVotes) => prevVotes + 1);
            localStorage.setItem(`vote-${toolId}`, 'upvote');
            setVoteAction('upvote');
        }
    };

    const downVoteButtonClick = async () => {
        // Check local storage for vote
        const localVote = localStorage.getItem(`vote-${toolId}`);

        if (localVote) {
            // check if we have an upvote
            if (localVote === 'upvote') {
                // voteData -= 2;
                setVotes((prevVotes) => prevVotes - 2);
                await submitVote(toolId, -1);
                localStorage.setItem(`vote-${toolId}`, 'downvote');
                setVoteAction('downvote');
            }
        } else {
            // No vote in local storage. Add downvote
            await submitVote(toolId, -1);
            setVotes((prevVotes) => prevVotes - 1);
            localStorage.setItem(`vote-${toolId}`, 'downvote');
            setVoteAction('downvote');
        }
    };

    return (
        <>
            <div className={cn(theme)}>
                <button
                    className={cn(styles.voteBtn, {
                        [styles.activeUpvote]: voteAction === 'upvote',
                    })}
                    onClick={upVoteButtonClick}></button>
                <span className={styles.votes}>{votesFormatter(votes)}</span>
                <button
                    className={classNames(styles.voteBtn, styles.downvoteBtn, {
                        [styles.activeDownvote]: voteAction === 'downvote',
                    })}
                    onClick={downVoteButtonClick}></button>
            </div>
            {showPercentage && (
                <div className={styles.upvotePercentage}>
                    {votes > 0 &&
                        `${Math.round((votes / (votes + 1)) * 100)}% upvoted`}
                </div>
            )}
        </>
    );
};

export default VoteWidget;
