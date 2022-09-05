import { FC } from 'react';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';

import React from 'react';
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
    stars: { date: string; count: number }[];
}

const GithubStarsCard: FC<GithubStarsCardProps> = ({ stars }) => {
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
        labels: stars.map((star) => star.date),
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
                    gradient.addColorStop(0.1, 'rgba(0, 231, 255, 0.02)');
                    gradient.addColorStop(1, 'rgba(0, 231, 255, 0)');
                    return gradient;
                },
                data: stars.map((star) => star.count),
                fill: true,
            },
        ],
    };

    return (
        <Card className="m-b-30">
            <Heading level={3} className="m-b-16 font-bold">
                Github Star History
            </Heading>
            <Line options={options} data={data} />
        </Card>
    );
};

export default GithubStarsCard;
