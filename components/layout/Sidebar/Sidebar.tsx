import { FC } from 'react';
import styles from './Sidebar.module.css';

const Sidebar: FC = ({ children }) => {
    return <div className={styles.sidebar}>{children}</div>;
};

export default Sidebar;
