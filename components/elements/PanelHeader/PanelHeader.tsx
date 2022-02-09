import { FC } from 'react';
import cn from 'classnames';
import styles from './PanelHeader.module.css';
import { Heading } from '@components/typography';

export interface PanelHeaderProps {
    level: 1 | 2 | 3 | 4;
    text: string;
    className?: string;
    headingClass?: string;
    children?: React.ReactNode;
}

const PanelHeader: FC<PanelHeaderProps> = ({
    level,
    text,
    className,
    headingClass,
    children,
}) => {
    const dClass = cn(styles.panelHeader, className);
    const hClass = cn('inline', 'font-bold', headingClass);

    return (
        <div className={dClass}>
            <div className={styles.title}>
                <Heading level={level} className={hClass}>
                    {text}
                </Heading>
            </div>
            <div className={styles.actionBtns}>{children}</div>
        </div>
    );
};

export default PanelHeader;
