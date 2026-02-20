import { FC, useEffect, useState } from 'react';
import { fetchToolVotes, submitVote, votesFormatter } from 'utils/votes';
import cn from 'classnames';
import styles from './VoteWidget.module.css';
import { LoadingDots } from '@components/elements';

export interface VoteWidgetProps {
    toolId: string;
    type?: 'primary' | 'secondary';
    upvotePercentage?: number;
    initialVotes?: number;
    initialUpvotePercentage?: number;
    className?: string;
}

const VoteWidget: FC<VoteWidgetProps> = ({
    toolId,
    type = 'primary',
    upvotePercentage,
    initialVotes,
    initialUpvotePercentage,
    className,
}) => {
    const theme = type === 'primary' ? styles.primary : styles.secondary;
    const [votes, setVotes] = useState(initialVotes ?? 0);
    const [voteAction, setVoteAction] = useState('');
    const [isFetching, setIsFetching] = useState(initialVotes === undefined);
    const [hasError, setHasError] = useState(false);
    const [resolvedUpvotePercentage, setResolvedUpvotePercentage] = useState(
        initialUpvotePercentage ?? upvotePercentage,
    );

    useEffect(() => {
        let isMounted = true;
        const localVote = localStorage.getItem(`vote-${toolId}`);
        if (localVote) {
            setVoteAction(localVote);
        }

        const loadVotes = async () => {
            setIsFetching(true);
            setHasError(false);
            const response = await fetchToolVotes(toolId);
            if (!isMounted) {
                return;
            }
            const data = response?.data;
            if (!data) {
                setHasError(true);
            } else {
                setVotes(data.votes);
                setResolvedUpvotePercentage(
                    data.upvotePercentage ?? upvotePercentage,
                );
            }
            setIsFetching(false);
        };

        void loadVotes();

        return () => {
            isMounted = false;
        };
    }, [toolId, upvotePercentage]);

    if (isFetching && initialVotes === undefined) {
        return (
            <div className={cn(theme)}>
                <LoadingDots />
            </div>
        );
    }
    if (hasError && initialVotes === undefined) {
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
                    className={cn(styles.voteBtn, styles.downvoteBtn, {
                        [styles.activeDownvote]: voteAction === 'downvote',
                    })}
                    aria-label={`Downvote ${toolId}`}
                    onClick={() => handleVote(-1, 'downvote')}
                />
            </div>
            {resolvedUpvotePercentage !== undefined && (
                <div className={styles.upvotePercentage}>
                    {resolvedUpvotePercentage}% upvoted
                </div>
            )}
        </>
    );
};

export default VoteWidget;
