import { FC } from 'react';
import Giscus from '@giscus/react';
import styles from './Comments.module.css';

const Comments: FC = () => {
    return (
        <div className={styles.commentWrapper}>
            <Giscus
                id="comments"
                repo="analysis-tools-dev/website-comments"
                repoId="MDEwOlJlcG9zaXRvcnkyNzI2MjQzNjI="
                category="General"
                categoryId="MDE4OkRpc2N1c3Npb25DYXRlZ29yeTg2MzkzMTg="
                mapping="pathname"
                term="Welcome to @giscus/react component!"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="bottom"
                theme="https://giscus.app/themes/custom_example.css"
                lang="en"
                loading="lazy"
            />
        </div>
    );
};

export default Comments;
