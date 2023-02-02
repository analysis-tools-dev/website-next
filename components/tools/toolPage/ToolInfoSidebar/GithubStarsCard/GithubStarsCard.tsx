import React from 'react';
import { FC } from 'react';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import styles from './GithubStarsCard.module.css';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Tool } from '@components/tools/types';
import { StarHistory } from 'utils/types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
);

export interface GithubStarsCardProps {
    tool: Tool;
    starHistory: StarHistory;
}

const GithubStarsCard: FC<GithubStarsCardProps> = ({ tool, starHistory }) => {
    const options = {
        responsive: true,
        tension: 0.5,
        cubicInterpolationMode: 'monotone',
        scales: {
            x: {
                ticks: {
                    color: 'white',
                    beginAtZero: true,
                    font: { size: 10 },
                },
            },
            y: {
                ticks: {
                    color: 'white',
                    beginAtZero: true,
                    font: { size: 10 },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
    };
    const data = {
        labels: starHistory?.map((star) => star.date),
        datasets: [
            {
                label: 'Stars',
                showGrid: false,
                borderColor: '#05CBE1',
                pointBackgroundColor: 'white',
                borderWidth: 1,
                pointBorderColor: 'white',
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 450);
                    gradient.addColorStop(0, 'rgba(0, 231, 255, 0.5)');
                    gradient.addColorStop(0.13, 'rgba(0, 231, 255, 0.02)');
                    gradient.addColorStop(1, 'rgba(0, 231, 255, 0)');
                    return gradient;
                },
                data: starHistory?.map((star) => star.count),
                fill: true,
            },
        ],
    };

    const github = tool.repositoryData;
    if (!github?.source) {
        return null;
    }

    return (
        <Card>
            <Heading level={3} className="m-b-16 font-bold">
                <a
                    className={styles.link}
                    href={`https://star-history.com/#${github.owner}/${github.name}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    Github Star History
                </a>
            </Heading>
            <Line options={options} data={data} />
        </Card>
    );
};

export default GithubStarsCard;
