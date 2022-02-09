import { FC } from 'react';
import styles from './Main.module.css';

const Main: FC = ({ children }) => {
    return <main className={styles.main}>{children}</main>;
};

export default Main;
