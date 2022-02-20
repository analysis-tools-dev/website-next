import { FC } from 'react';
import classNames from 'classnames';
import styles from './Card.module.css';

export interface CardProps {
    className?: string;
}

const Card: FC<CardProps> = ({ className, children }) => {
    return <div className={classNames(styles.card, className)}>{children}</div>;
};

export default Card;
