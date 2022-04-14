import { FC } from 'react';
import Image from 'next/image';
import styles from './InfoEntry.module.css';
import { isValidHttpUrl } from 'utils/strings';
import cn from 'classnames';

export interface InfoEntryProps {
    label: string;
    id: string;
    value: string;
    icon?: string;
    className?: string;
}

const InfoEntry: FC<InfoEntryProps> = ({
    label,
    id,
    value,
    icon,
    className,
}) => {
    const isURL = isValidHttpUrl(value);
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
                {isURL ? (
                    <a
                        className={styles.entryUrl}
                        href={value}
                        target={'_blank'}
                        rel="noreferrer">
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
