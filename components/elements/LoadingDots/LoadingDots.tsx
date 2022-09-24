import { FC } from 'react';
import cn from 'classnames';
import styles from './LoadingDots.module.css';

export interface LoadingDotsProps {
    className?: string;
}

const LoadingDots: FC<LoadingDotsProps> = ({ className }) => {
    return (
        <div className={cn(styles.dotWrapper, className)}>
            <div className={styles['dot-flashing']}></div>
        </div>
    );
};

export default LoadingDots;
