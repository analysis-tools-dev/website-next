import { FC } from 'react';
import styles from './Wrapper.module.css';

const Wrapper: FC = ({ children }) => {
    return <div className={styles.wrapper}>{children}</div>;
};

export default Wrapper;
