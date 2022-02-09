import { FC } from 'react';
import styles from './Panel.module.css';

const Panel: FC = ({ children }) => {
    return <div className={styles.panel}>{children}</div>;
};

export default Panel;
