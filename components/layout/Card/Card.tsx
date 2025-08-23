import { FC } from 'react';
import classNames from 'classnames';
import styles from './Card.module.css';

export interface CardProps {
    className?: string;
    children?: React.ReactNode[] | React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Card: FC<CardProps> = ({ className, children, onClick }) => {
    return (
        <div className={classNames(styles.card, className)} onClick={onClick}>
            {children}
        </div>
    );
};

export default Card;
