import { FC } from 'react';
import classNames from 'classnames';
import styles from './Sidebar.module.css';

export interface SidebarProps {
    className?: string;
    children?: React.ReactNode[];
}

const Sidebar: FC<SidebarProps> = ({ children, className }) => {
    return (
        <div className={classNames(styles.sidebar, className)}>{children}</div>
    );
};

export default Sidebar;
