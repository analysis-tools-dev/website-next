import { FC } from 'react';
import Link from 'next/link';
import { Text } from '@components/typography';
import styles from './SuggestLink.module.css';

const SuggestLink: FC = () => {
    return (
        <Text className={styles.suggestLink}>
            Help make this list better.
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/analysis-tools-dev/static-analysis/blob/master/CONTRIBUTING.md">
                Suggest Tools
            </a>
        </Text>
    );
};

export default SuggestLink;
