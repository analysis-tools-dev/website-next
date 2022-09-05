import { FC } from 'react';
import classNames from 'classnames';
import styles from './Main.module.css';

export interface MainProps {
    className?: string;
    children?: React.ReactNode;
}

const Main: FC<MainProps> = ({ children, className }) => {
    return (
        <main className={classNames(styles.main, className)}>{children}</main>
    );
};

export default Main;
