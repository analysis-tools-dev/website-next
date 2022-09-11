import { FC } from 'react';
import { Card } from '@components/layout';

import styles from './DetailCard.module.css';
import ReactMarkdown from 'react-markdown';

export interface DetailCardProps {
    summary: string;
    text: string;
}

const DetailCard: FC<DetailCardProps> = ({ summary, text }) => {
    return (
        <Card className="m-b-30">
            <details>
                <summary>{summary}</summary>
                <ReactMarkdown>{text}</ReactMarkdown>
            </details>
        </Card>
    );
};

export default DetailCard;
