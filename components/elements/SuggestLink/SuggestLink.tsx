import { FC } from 'react';
import Link from 'next/link';
import { Text } from '@components/typography';
import styles from './SuggestLink.module.css';

const SuggestLink: FC = () => {
    return (
        <Text className={styles.suggestLink}>
            Help make this list better
            <br />
            <Link href="/contributing">Suggest Tools</Link>
        </Text>
    );
};

export default SuggestLink;
