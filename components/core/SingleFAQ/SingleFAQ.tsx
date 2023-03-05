import { FC } from 'react';
import styles from './SingleFAQ.module.css';
import { Wrapper } from '@components/layout';
import { Faq } from 'utils/types';

export interface SingleFaqProps {
    faq: Faq;
}

const FAQ: FC<SingleFaqProps> = ({ faq }) => {
    return (
        <section className={styles.faq}>
            <Wrapper className={styles.wrapper}>
                <h2 className={styles.heading}>{faq.question}</h2>
                {faq.answer.split('\n').map(function (answer, index) {
                    return (
                        <p className={styles.answer} key={index}>
                            {answer}
                        </p>
                    );
                })}
            </Wrapper>
        </section>
    );
};

export default FAQ;
