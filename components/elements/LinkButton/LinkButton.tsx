import { FC } from 'react';
import Link from 'next/link';
import styles from './LinkButton.module.css';

export interface LinkButtonProps {
    label: string;
    href: string;
    newTab?: boolean;
    type?: 'primary' | 'secondary' | 'github';
    variant?: 'big' | 'normal' | 'small';
    className?: string;
}

const LinkButton: FC<LinkButtonProps> = ({
    label,
    href,
    newTab = false,
    type = 'primary',
    variant = 'normal',
    className = '',
}) => {
    return newTab ? (
        <a
            className={`${styles.btn} ${styles[type]} ${styles[variant]} ${className}`}
            href={href}
            itemProp="url"
            target="_blank"
            rel="noopener noreferrer">
            {label}
        </a>
    ) : (
        <Link
            href={href}
            className={`${styles.btn} ${styles[type]} ${styles[variant]} ${className}`}>
            {label}
        </Link>
    );
};

export default LinkButton;
