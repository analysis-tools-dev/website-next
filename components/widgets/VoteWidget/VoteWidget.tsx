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
    upvotePercentage?: number;
    className?: string;
}

const VoteWidget: FC<VoteWidgetProps> = ({
    toolId,
    type = 'primary',
    upvotePercentage,
    className,
}) => {
    const theme = type === 'primary' ? styles.primary : styles.secondary;
    const [votes, setVotes] = useState(0);
    const [voteAction, setVoteAction] = useState('');

    const { data, isLoading, isFetching, isRefetching, error } =
        useToolVotesQuery(toolId);

    const votesData = data?.data;
    console.log('Got votes data', votesData);

    useEffect(() => {
        const localVote = localStorage.getItem(`vote-${toolId}`);
        if (votesData?.votes !== undefined) {
            setVotes(votesData.votes);
        }
        if (localVote) {
            setVoteAction(localVote);
        }
    }, [votesData, toolId]);

    if (isLoading || isFetching || isRefetching) {
        return (
            <div className={cn(theme)}>
                <LoadingDots />
            </div>
        );
    }
    if (error || !votesData) {
        return null;
    }

    const handleVote = async (voteChange: number, action: string) => {
        const localVote = localStorage.getItem(`vote-${toolId}`);
        let newVotes = votes;

        if (localVote) {
            if (localVote === 'upvote' && action === 'downvote') {
                newVotes -= 2;
            } else if (localVote === 'downvote' && action === 'upvote') {
                newVotes += 2;
            } else {
                return; // Same vote action, no change
            }
        } else {
            newVotes += voteChange;
        }

        setVotes(newVotes);
        setVoteAction(action);
        await submitVote(toolId, voteChange);
        localStorage.setItem(`vote-${toolId}`, action);
    };

    return (
        <>
            <div className={cn(theme, className)}>
                <button
                    className={cn(styles.voteBtn, {
                        [styles.activeUpvote]: voteAction === 'upvote',
                    })}
                    aria-label={`Upvote ${toolId}`}
                    onClick={() => handleVote(1, 'upvote')}
                />
                <span className={styles.votes}>{votesFormatter(votes)}</span>
                <button
                    className={classNames(styles.voteBtn, styles.downvoteBtn, {
                        [styles.activeDownvote]: voteAction === 'downvote',
                    })}
                    aria-label={`Downvote ${toolId}`}
                    onClick={() => handleVote(-1, 'downvote')}
                />
            </div>
            {upvotePercentage !== undefined && (
                <div className={styles.upvotePercentage}>
                    {upvotePercentage}% upvoted
                </div>
            )}
        </>
    );
};

export default VoteWidget;
