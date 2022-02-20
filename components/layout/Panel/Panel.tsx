import { FC } from 'react';
import classNames from 'classnames';
import styles from './Panel.module.css';

export interface PanelProps {
    className?: string;
}

const Panel: FC<PanelProps> = ({ children, className }) => {
    return (
        <div className={classNames(styles.panel, className)}>{children}</div>
    );
};

export default Panel;
