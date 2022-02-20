import { FC } from 'react';
import classNames from 'classnames';
import styles from './Wrapper.module.css';

export interface WrapperProps {
    className?: string;
}

const Wrapper: FC<WrapperProps> = ({ children, className }) => {
    return (
        <div className={classNames(styles.wrapper, className)}>{children}</div>
    );
};

export default Wrapper;
