import { FC } from 'react';
import { Card } from '@components/layout';
import { Heading } from '@components/typography';
import styles from './GithubStarsCard.module.css';

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
import { getRepositoryMeta } from 'utils/github';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
);

export function getTimeStampByDate(t: Date | number | string): number {
    const d = new Date(t);
    return d.getTime();
}

function getDateString(t: Date | number | string, format = 'yyyy/MM'): string {
    const d = new Date(getTimeStampByDate(t));

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    // const date = d.getDate();
    // const hours = d.getHours();
    // const minutes = d.getMinutes();
    // const seconds = d.getSeconds();

    const formatedString = format
        .replace('yyyy', String(year))
        .replace('MM', String(month));

    return formatedString;
}

export interface GithubStarsCardProps {
    source: string | null;
    stars: { date: Date; count: number }[];
}

const GithubStarsCard: FC<GithubStarsCardProps> = ({ source, stars }) => {
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
        labels: stars.map((star) => getDateString(star.date)),
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
                data: stars.map((star) => star.count),
                fill: true,
            },
        ],
    };

    const github = getRepositoryMeta(source);
    if (!github) {
        return null;
    }

    return (
        <Card>
            <Heading level={3} className="m-b-16 font-bold">
                <a
                    className={styles.link}
                    href={`https://star-history.com/#${github.owner}/${github.repo}`}
                    target="_blank"
                    rel="noreferrer">
                    Github Star History
                </a>
            </Heading>
            <Line options={options} data={data} />
        </Card>
    );
};

export default GithubStarsCard;
