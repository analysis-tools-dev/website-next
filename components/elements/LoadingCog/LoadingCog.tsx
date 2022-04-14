import { FC } from 'react';
import styles from './LoadingCog.module.css';

const LoadingCog: FC = () => {
    return (
        <div>
            <div className={styles.loadingioSpinnerGear}>
                <div className={styles.ldio}>
                    <div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingCog;
