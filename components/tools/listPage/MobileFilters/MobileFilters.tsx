import { Button } from '@components/elements';
import { FC } from 'react';
import styles from './MobileFilters.module.css';

const MobileFilters: FC = () => {
    return (
        <>
            <div className={styles.mobileFilterForm}>
                <Button className="filterBtn" theme="secondary">
                    Filter
                </Button>
                <Button className="filterBtn" theme="secondary">
                    Sort
                </Button>
            </div>
        </>
    );
};

export default MobileFilters;
