import { FC, useEffect, useState } from 'react';
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
    const [votes, setVotes] = useState(0);

    const { data, isLoading, isFetching, isRefetching, error, refetch } =
        useToolVotesQuery(toolId);

    useEffect(() => {
        if (data?.votes) {
            setVotes(data?.votes || 0);
        }
    }, [data]);

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
        console.log('upVoteButtonClick');
        // Check local storage for vote
        const localVote = localStorage.getItem(`vote-${toolId}`);

        console.log('localVote', localVote);

        if (localVote) {
            // check if it was a downvote
            if (localVote === 'downvote') {
                // voteData += 2;
                setVotes((prevVotes) => prevVotes + 2);
                // remove downvote and add upvote
                // await submitVote(toolId, 1);
                localStorage.setItem(`vote-${toolId}`, 'upvote');
            }
        } else {
            // No vote in local storage. Add upvote
            // await submitVote(toolId, 1);
            // voteData += 1;
            setVotes((prevVotes) => prevVotes + 1);
            localStorage.setItem(`vote-${toolId}`, 'upvote');
        }
        console.log('upVoteButtonClick', votes);
    };

    const downVoteButtonClick = async () => {
        // Check local storage for vote
        const localVote = localStorage.getItem(`vote-${toolId}`);

        if (localVote) {
            // check if we have an upvote
            if (localVote === 'upvote') {
                // voteData -= 2;
                setVotes((prevVotes) => prevVotes - 2);
                // remove upvote and add downvote
                // await submitVote(toolId, -1);
                localStorage.setItem(`vote-${toolId}`, 'downvote');
            }
        } else {
            // No vote in local storage. Add downvote
            // await submitVote(toolId, -1);
            // voteData -= 1;
            setVotes((prevVotes) => prevVotes - 1);
            localStorage.setItem(`vote-${toolId}`, 'downvote');
        }
        console.log('downVoteButtonClick', votes);
    };

    return (
        <div className={cn(theme)}>
            <button
                className={styles.voteBtn}
                onClick={upVoteButtonClick}></button>
            <span className={styles.votes}>{votesFormatter(votes)}</span>
            <button
                className={cn(styles.voteBtn, styles.downvoteBtn)}
                onClick={downVoteButtonClick}></button>
        </div>
    );
};

export default VoteWidget;
