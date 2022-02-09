import { FC } from 'react';
import cn from 'classnames';
import styles from './Card.module.css';

export interface CardProps {
    className?: string;
    children: React.ReactNode;
}

const Card: FC<CardProps> = ({ className, children }) => {
    return <div className={cn(styles.card, className)}>{children}</div>;
};

export default Card;
