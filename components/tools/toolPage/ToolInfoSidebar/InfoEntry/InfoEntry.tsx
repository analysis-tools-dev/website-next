import { FC } from 'react';
import Image from 'next/image';
import styles from './InfoEntry.module.css';
import { isValidHttpUrl } from 'utils/strings';
import cn from 'classnames';

export interface InfoEntryProps {
    label: string;
    url?: string;
    id: string;
    value: string;
    icon?: string;
    className?: string;
}

const InfoEntry: FC<InfoEntryProps> = ({
    label,
    url = undefined,
    id,
    value,
    icon,
    className,
}) => {
    if (url === undefined && isValidHttpUrl(value)) {
        url = value;
    }

    return (
        <div className={cn(styles.entryWrapper, className)}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <div className={styles.textWrapper}>
                {icon && (
                    <div className={styles.entryIcon}>
                        <Image
                            height="12px"
                            width="12px"
                            src={icon}
                            alt={label}
                        />
                    </div>
                )}
                {url ? (
                    <a
                        className={styles.entryUrl}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer">
                        {value}
                    </a>
                ) : (
                    <span className={styles.entryText}>
                        {value.toLocaleString()}
                    </span>
                )}
            </div>
        </div>
    );
};

export default InfoEntry;
